import os



GROUND_LEVEL = int(os.environ.get('DELOG_GROUND_LEVEL', 0))

FORMAT = os.environ.get('DELOG_FORMAT', '%TIME %TEXT')

ENDPOINT = os.environ.get('DELOG_ENDPOINT')
TOKEN = os.environ.get('DELOG_TOKEN')

PROJECT = os.environ.get('DELOG_PROJECT', '')
SPACE = os.environ.get('DELOG_SPACE', '')


LOG_LEVEL_FATAL=6
LOG_LEVEL_ERROR=5
LOG_LEVEL_WARN=4
LOG_LEVEL_INFO=3
LOG_LEVEL_DEBUG=2
LOG_LEVEL_TRACE=1

log_levels = {
    "fatal": LOG_LEVEL_FATAL,
    "error": LOG_LEVEL_ERROR,
    "warn": LOG_LEVEL_WARN,
    "info": LOG_LEVEL_INFO,
    "debug": LOG_LEVEL_DEBUG,
    "trace": LOG_LEVEL_TRACE,
}
