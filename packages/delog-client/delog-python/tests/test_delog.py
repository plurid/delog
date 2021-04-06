# Run with
# python -m tests.test_delog


#region imports
import unittest

from delog import delog, delog_levels
#endregion imports



#region module
endpoint='http://localhost:56965/delog'
token='__TESTS__'


class TestDelog(unittest.TestCase):
    def test_simple(self):
        delog(
            text="simple test",

            endpoint=endpoint,
            token=token,
        )

    def test_simple_call(self):
        delog(
            text="simple test",

            endpoint=endpoint,
            token=token,

            context={
                "call": {
                    "repository": {
                        "provider": "test_code_provider",
                        "name": "test_repository_name",
                        "basepath": "/home/",
                    }
                },
            },
        )

    def test_simple_full(self):
        delog(
            text="full test",

            endpoint=endpoint,
            token=token,

            project="project-python",
            space="space-python",

            format="%TEXT -- %TIME",

            level=delog_levels["warn"],
            method="some-method",
            extradata='{ "some": "json"}',
            # context={},
        )

    def test_error_body(self):
        error = ''
        try:
            raise Exception("some exception")
        except Exception as x:
            error = x

        delog(
            text="test with error",
            level=4,

            endpoint=endpoint,
            token=token,

            project="project-python",
            space="space-python",

            error=error,
        )
#endregion module


#region runner
if __name__ == '__main__':
    unittest.main()
#endregion runner
