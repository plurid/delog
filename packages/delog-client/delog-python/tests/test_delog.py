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
            endpoint=endpoint,
            token=token,
            text="simple test",
        )

    def test_simple_full(self):
        delog(
            endpoint=endpoint,
            token=token,

            format="%TEXT -- %TIME",

            project="project-python",
            space="space-python",

            level=delog_levels["warn"],
            method="some-method",

            shared_id="one",
            shared_order=1,

            # error=,

            extradata='{ "some": "json"}',

            # context={},

            text="full test",
        )

    def test_error_body(self):
        error = ''
        try:
            raise Exception("some exception")
        except Exception as x:
            error = x

        delog(
            endpoint=endpoint,
            token=token,

            project="project-python",
            space="space-python",

            level=4,

            error=error,

            text="test with error",
        )
#endregion module


#region runner
if __name__ == '__main__':
    unittest.main()
#endregion runner
