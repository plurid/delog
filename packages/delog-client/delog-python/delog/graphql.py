from python_graphql_client import GraphqlClient

from delog.constants import ENDPOINT, TOKEN



def client(
    endpoint: str = ENDPOINT,
    token: str = TOKEN,
):
    token_value = 'Bearer ' + token

    headers = {
        "Authorization": token_value
    }

    client = GraphqlClient(endpoint=endpoint, headers=headers)

    return client


RECORD = """
    mutation DelogMutationRecord($input: DelogInputRecord!) {
        delogMutationRecord(input: $input) {
            status
        }
    }
"""
