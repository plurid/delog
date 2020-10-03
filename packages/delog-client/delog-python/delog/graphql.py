from python_graphql_client import GraphqlClient

from constants import ENDPOINT



def client(
    endpoint: str = ENDPOINT,
):
    return GraphqlClient(endpoint=endpoint)


RECORD = """
    mutation DelogMutationRecord($input: DelogInputRecord!) {
        delogMutationRecord(input: $input) {
            status
        }
    }
"""
