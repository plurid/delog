from .delog import Client, DelogError, LEVELS, delog

__version__ = "0.2.0"
delog_levels = LEVELS
DELOG_LEVEL_FATAL = 6
DELOG_LEVEL_ERROR = 5
DELOG_LEVEL_WARN = 4
DELOG_LEVEL_INFO = 3
DELOG_LEVEL_DEBUG = 2
DELOG_LEVEL_TRACE = 1

__all__ = [
    "Client", "DelogError", "delog", "delog_levels", "DELOG_LEVEL_FATAL",
    "DELOG_LEVEL_ERROR", "DELOG_LEVEL_WARN", "DELOG_LEVEL_INFO",
    "DELOG_LEVEL_DEBUG", "DELOG_LEVEL_TRACE",
]
