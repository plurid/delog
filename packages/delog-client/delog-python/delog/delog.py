"""Synchronous, dependency-free Delog client for Python 3.10+."""

from __future__ import annotations

import inspect
import json
import os
import sys
import time
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener

LEVELS = {"trace": 1, "debug": 2, "info": 3, "warn": 4, "error": 5, "fatal": 6}
RECORD = """
mutation DelogMutationRecord($input: DelogInputRecord!) {
  delogMutationRecord(input: $input) { status error { code message } }
}
"""


class DelogError(RuntimeError):
    """A record was not accepted by the server."""


class _NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, request, file, code, message, headers, new_url):
        # An ingestion credential must never follow an endpoint redirect.
        return None


def _level(value: int | str, maximum: int = 6) -> int:
    if isinstance(value, str):
        value = LEVELS.get(value, int(value) if value.isdigit() else -1)
    if isinstance(value, bool) or not isinstance(value, int) or not 0 <= value <= maximum:
        raise DelogError(f"Level must be between 0 and {maximum}.")
    return value


def _source_context(context: dict[str, Any]) -> dict[str, Any]:
    result = dict(context)
    for legacy, canonical in (("shared_id", "sharedID"), ("shared_order", "sharedOrder")):
        if legacy in result:
            result.setdefault(canonical, result.pop(legacy))

    call = result.get("call")
    if call is None and os.getenv("DELOG_CALL_CONTEXT") != "true":
        return result
    call = dict(call or {})
    repository = {
        "provider": os.getenv("DELOG_REPOSITORY_PROVIDER", ""),
        "name": os.getenv("DELOG_REPOSITORY_NAME", ""),
        "branch": os.getenv("DELOG_REPOSITORY_BRANCH", ""),
        "commit": os.getenv("DELOG_REPOSITORY_COMMIT", ""),
        "basePath": os.getenv("DELOG_REPOSITORY_BASEPATH", ""),
        **call.get("repository", {}),
    }
    caller = call.get("caller")
    if caller is None:
        frame = inspect.currentframe()
        try:
            while frame is not None and frame.f_code.co_filename == __file__:
                frame = frame.f_back
            if frame is None:
                result.pop("call", None)
                return result
            filename = frame.f_code.co_filename
            base = repository["basePath"].rstrip("/\\")
            if base and filename.startswith(base + os.sep):
                filename = filename[len(base) + 1 :]
            caller = {"file": filename, "line": frame.f_lineno, "column": 0}
        finally:
            del frame
    result["call"] = {"repository": repository, "caller": caller}
    return result


class Client:
    def __init__(
        self,
        endpoint: str | None = None,
        token: str | None = None,
        *,
        project: str | None = None,
        space: str | None = None,
        ground_level: int | str | None = None,
        timeout: float = 10,
    ):
        self.endpoint = endpoint if endpoint is not None else os.getenv("DELOG_ENDPOINT", "")
        self.token = token if token is not None else os.getenv("DELOG_TOKEN", "")
        self.project = project if project is not None else os.getenv("DELOG_PROJECT", "")
        self.space = space if space is not None else os.getenv("DELOG_SPACE", "")
        self.ground_level = _level(
            ground_level if ground_level is not None else os.getenv("DELOG_GROUND_LEVEL", "0"),
            7,
        )
        if not 0 < timeout <= 300:
            raise DelogError("timeout must be greater than 0 and at most 300 seconds.")
        self.timeout = timeout
        self._opener = build_opener(_NoRedirect())

    def record(
        self,
        text: str,
        level: int | str = 3,
        *,
        project: str | None = None,
        space: str | None = None,
        format: str | None = None,
        tester: bool = False,
        method: str | None = None,
        error: Any = None,
        extradata: str | None = None,
        context: dict[str, Any] | None = None,
    ) -> bool:
        severity = _level(level)
        if tester and (context or {}).get("mode") != "TESTING":
            return False
        if severity < self.ground_level:
            return False
        if severity < 1 or not isinstance(text, str):
            raise DelogError("A record requires text and a severity from 1 to 6.")
        url = urlsplit(self.endpoint)
        if url.scheme not in ("http", "https") or not url.netloc or url.username or url.password:
            raise DelogError("Endpoint must be an HTTP(S) URL without credentials.")

        record = {
            "text": text,
            "level": severity,
            "time": time.time_ns() // 1000,
            "unit": "us",
            "project": self.project if project is None else project,
            "space": self.space if space is None else space,
            "context": _source_context(context or {}),
        }
        for name, value in (
            ("format", format if format is not None else os.getenv("DELOG_FORMAT")),
            ("method", method),
            ("error", error if isinstance(error, str) else repr(error) if error is not None else None),
            ("extradata", extradata),
        ):
            if value is not None:
                record[name] = value

        body = json.dumps({"query": RECORD, "variables": {"input": record}}).encode("utf-8")
        headers = {"Content-Type": "application/json"}
        if self.token:
            headers["Authorization"] = "Bearer " + self.token
        request = Request(self.endpoint, data=body, headers=headers, method="POST")
        try:
            with self._opener.open(request, timeout=self.timeout) as response:
                payload = response.read(1_048_577)
                if len(payload) > 1_048_576:
                    raise DelogError("Server response exceeds 1 MiB.")
                result = json.loads(payload)
        except HTTPError as error:
            raise DelogError(f"Delog returned HTTP {error.code}.") from error
        except (URLError, TimeoutError, OSError, ValueError) as error:
            raise DelogError("Could not submit the record.") from error

        if not isinstance(result, dict) or not isinstance(result.get("data"), (dict, type(None))):
            raise DelogError("Invalid record acknowledgement.")
        mutation = (result.get("data") or {}).get("delogMutationRecord") or {}
        if not isinstance(mutation, dict):
            raise DelogError("Invalid record acknowledgement.")
        if result.get("errors") or not mutation.get("status"):
            raise DelogError((mutation.get("error") or {}).get("message", "Server rejected the record."))
        return True


def delog(
    text: str,
    level: int | str = 3,
    endpoint: str | None = None,
    token: str | None = None,
    format: str | None = None,
    project: str | None = None,
    space: str | None = None,
    tester: bool = False,
    method: str | None = None,
    error: Any = None,
    extradata: str | None = None,
    context: dict[str, Any] | None = None,
) -> bool | None:
    """Compatibility function: report a failure without throwing into application code."""
    try:
        accepted = Client(endpoint, token, project=project, space=space).record(
            text,
            level,
            format=format,
            tester=tester,
            method=method,
            error=error,
            extradata=extradata,
            context=context,
        )
        return True if accepted else None
    except DelogError as failure:
        if os.getenv("DELOG_QUIET") != "true":
            print(f"Delog Error :: {failure}", file=sys.stderr)
        return None
