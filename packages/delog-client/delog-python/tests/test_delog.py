import json
import os
import sys
import threading
import time
import unittest
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from delog import Client, DelogError, delog


class Receiver(BaseHTTPRequestHandler):
    def do_POST(self):
        size = int(self.headers["Content-Length"])
        self.server.records.append(json.loads(self.rfile.read(size)))
        self.server.authorization = self.headers.get("Authorization")
        self.send_response(self.server.response_status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(self.server.response_body).encode())

    def log_message(self, *_args):
        pass


class ClientTests(unittest.TestCase):
    def setUp(self):
        self.server = ThreadingHTTPServer(("127.0.0.1", 0), Receiver)
        self.server.records = []
        self.server.response_status = 200
        self.server.response_body = {"data": {"delogMutationRecord": {"status": True}}}
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.endpoint = f"http://127.0.0.1:{self.server.server_port}/graphql"

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()

    def test_wire_contract_and_microsecond_time(self):
        client = Client(self.endpoint, "test-token", project="api")
        self.assertTrue(client.record("connected", "info"))
        record = self.server.records[0]["variables"]["input"]
        self.assertEqual(record["unit"], "us")
        self.assertLess(abs(record["time"] / 1_000_000 - time.time()), 2)
        self.assertEqual(record["level"], 3)
        self.assertEqual(record["project"], "api")
        self.assertEqual(self.server.authorization, "Bearer test-token")

    def test_legacy_context_aliases_do_not_mutate_caller(self):
        context = {"mode": "TESTING", "shared_id": "request-1", "shared_order": 0}
        client = Client(self.endpoint, "test-token")
        client.record("phase", context=context)
        serialized = self.server.records[0]["variables"]["input"]["context"]
        self.assertEqual(serialized["sharedID"], "request-1")
        self.assertEqual(serialized["sharedOrder"], 0)
        self.assertNotIn("sharedID", context)

    def test_rejects_server_errors_and_false_acknowledgements(self):
        client = Client(self.endpoint, "test-token")
        self.server.response_status = 401
        with self.assertRaises(DelogError):
            client.record("unauthorized")
        self.server.response_status = 200
        self.server.response_body = {"data": {"delogMutationRecord": {"status": False}}}
        with self.assertRaises(DelogError):
            client.record("rejected")
        self.server.response_body = {"errors": [{"message": "invalid input"}]}
        with self.assertRaises(DelogError):
            client.record("graphql failure")

    def test_filtering_and_testing_mode_skip_network(self):
        client = Client(self.endpoint, "test-token", ground_level="warn")
        self.assertFalse(client.record("debug", "debug"))
        self.assertFalse(client.record("test-only", "error", tester=True))
        self.assertEqual(self.server.records, [])

    def test_compatibility_reads_environment_at_call_time(self):
        with patch.dict(os.environ, {"DELOG_ENDPOINT": self.endpoint, "DELOG_TOKEN": "dynamic"}):
            self.assertTrue(delog("environment changed"))
        self.assertEqual(self.server.authorization, "Bearer dynamic")

    def test_rejects_credentials_in_endpoint(self):
        with self.assertRaises(DelogError):
            Client("http://name:password@example.com/graphql", "token").record("private")


if __name__ == "__main__":
    unittest.main()
