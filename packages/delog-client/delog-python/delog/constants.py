import os



GROUND_LEVEL = os.environ.get('DELOG_GROUND_LEVEL', 0)

FORMAT = os.environ.get('DELOG_FORMAT', '%TIME %TEXT')

ENDPOINT = os.environ.get('DELOG_ENDPOINT')
TOKEN = os.environ.get('DELOG_TOKEN')

PROJECT = os.environ.get('DELOG_PROJECT', '')
SPACE = os.environ.get('DELOG_SPACE', '')
