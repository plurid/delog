// #region module
const FORMAT_PRIMITIVES: string[] = [
    'TIME',
    'SPACE',
    'LEVEL',
    'TEXT',
];


class Formatter {
    private date: Date;

    constructor(
        time: number,
    ) {
        const date = new Date(time);

        this.date = date;
    }

    /**
     * Given a format string and the data, it returns the
     * @param value
     */
    format(
        value: string,
    ) {

    }

    /**
     * Returns an array of identifiers that are not primitives.
     * E.g. from `'$TIME $TEXT $CUSTOM'` it returns `[ 'CUSTOM' ]`.
     *
     * @param value
     */
    nonPrimitives(
        value: string,
    ) {
        const re = /(\$\w+)/gi;
        const match = value.match(re);

        if (!match) {
            return [];
        }

        const nonPrimitives: string[] = [];

        for (const element of match) {
            if (!FORMAT_PRIMITIVES.includes(element)) {
                nonPrimitives.push(element);
            }
        }

        return nonPrimitives;
    }
}
// #endregion module
