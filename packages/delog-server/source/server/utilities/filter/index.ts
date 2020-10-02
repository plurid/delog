// #region module
/**
 * A filter can be a string which can globally/generally match with something about a log
 * (a substring, a timestamp, etc), or can be a semi-structured query, as in `key: value` pairs,
 * comma-separated.
 *
 * @param filter
 */
const parseFilter = (
    filter: string | undefined,
) => {
    if (!filter) {
        return;
    }

    const groups = filter.split(',');

    if (groups.length === 0) {
        return filter;
    }

    const projects = [];
    const spaces = [];
    const levels = [];
    const logs = [];

    for (const group of groups) {
        const split = group.split(':');

        const key = split[0];
        const value = split[1];

        if (key && value) {
            const cleanKey = key.trim().toLowerCase();
            const cleanValue = value.trim().toLowerCase();

            switch (cleanKey) {
                case 'project':
                    projects.push(cleanValue);
                    break;
                case 'space':
                    spaces.push(cleanValue);
                    break;
                case 'level':
                    levels.push(cleanValue);
                    break;
                case 'log':
                    logs.push(cleanValue);
                    break;
            }
        }
    }

    const pairs = {
        projects,
        spaces,
        levels,
        logs,
    };

    return pairs;
}
// #endregion module



// #region exports
export {
    parseFilter,
};
// #endregion exports
