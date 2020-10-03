from graphql import client, RECORD

from constants import GROUND_LEVEL, FORMAT, ENDPOINT, TOKEN, PROJECT, SPACE



def delog(
    text: str,

    format: str = FORMAT,

    endpoint: str = ENDPOINT,
    token: str = TOKEN,

    project: str = PROJECT,
    space: str = SPACE,

    #  Log level:
    #  + FATAL: 6;
    #  + ERROR: 5;
    #  + WARN: 4;
    #  + INFO: 3;
    #  + DEBUG: 2;
    #  + TRACE: 1;
    level: int = 1,

    # Name of the method from where the log originates.
    method: str = '',

    # ID shared by multiple logs, used to identify a request spanning multiple services.
    shared_id: str = '',

    # If using the `shared_id`, the logs can be assigned an ordering number.
    # If not given, the logs will be ordered by time.
    #
    # The value should be greater than 0. If two or more logs have the same value,
    # they will be ordered by time.
    shared_order: int = -1,

    error = {},

    # Arbitrary data: a simple string, stringified JSON or deon.
    extradata: str = '',

    context = {},
):
    graphql_client = client(endpoint)

    variables = {
        "input": {
            "text": text,

            "format": format,

            "endpoint": endpoint,
            "token": token,

            "project": project,
            "space": space,

            "level": level,

            "method": method,

            "sharedID": shared_id,

            "sharedOrder": shared_order,

            "error" = error,

            "extradata": extradata,

            "context" = context,
        }
    }

    graphql_client.execute(mutation=RECORD, variables=variables)
