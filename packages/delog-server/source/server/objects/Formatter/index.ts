// #region imports
    // #region external
    import {
        Record as DelogRecord,
    } from '~server/data/interfaces';

    import {
        logLevelsText,
    } from '~server/data/constants';
    // #endregion external
// #endregion imports



// #region module
const FORMAT_PRIMITIVES: string[] = [
    'TIME',
    'SPACE',
    'LEVEL',
    'TEXT',
];


export type FormattingRule = (
    data: DelogRecord,
) => string;

export type FormattingRules = Record<string, FormattingRule>;


const primitiveFormattingRules: FormattingRules = {
    TIME: (
        data,
    ) => {
        const date = new Date(data.time / 1000);

        return date.toLocaleString();
    },
    PROJECT: (
        data,
    ) => {
        return data.project || '';
    },
    SPACE: (
        data,
    ) => {
        return data.space || '';
    },
    LEVEL: (
        data,
    ) => {
        return logLevelsText[data.level] || '';
    },
    TEXT: (
        data,
    ) => {
        return data.text;
    },
}


class Formatter {
    private data: DelogRecord;

    constructor(
        data: DelogRecord,
    ) {
        this.data = data;
    }

    /**
     * Given the data and optional extra formatting rules, it returns the formatted log.
     *
     * @param value
     */
    format(
        extraFormattingRules?: FormattingRules,
    ) {
        try {
            const formattingRules: FormattingRules = {
                ...primitiveFormattingRules,
                ...extraFormattingRules,
            };

            const re = /(%\w+)/gi;
            const match = this.data.format?.match(re);

            if (!match) {
                return '';
            }

            let logString = this.data.format || '';

            for (const element of match) {
                const value = element.replace('%', '');
                const formattingRule = formattingRules[value];

                if (!formattingRule) {
                    continue;
                }

                const formatResult = formattingRule(this.data);

                logString = logString.replace(element, formatResult);
            }

            return logString;
        } catch (error) {
            return '';
        }
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
        const re = /(%\w+)/gi;
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



// #region exports
export default Formatter;
// #endregion exports
