// #region imports
    // #region external
    import {
        RECORD,
    } from '../../services/graphql/mutate';

    import {
        getDelog,
    } from '../../services/utilities';
    // #endregion external
// #endregion imports



// #region module
const record = async (
    data: any,
    server?: string,
    identonym?: string,
) => {
    try {
        const {
            delog,
            configuration,
        } = await getDelog(
            server,
            identonym,
        );

        if (!delog || !configuration) {
            console.log('Could record to delog. Not logged in.');
            return;
        }

        const input = {
            text: data.text,
            time: Math.floor(Date.now() / 1000),
            level: data.level || 0,

            project: data.project || '',
            space: data.space || '',

            format: data.format || configuration.defaults.format || '%TIME %TEXT',

            method: data.method || '',
            error: data.error || '',
            extradata: data.extradata || '',
            context: data.context || {},
        };

        const mutation = await delog.mutate({
            mutation: RECORD,
            variables: {
                input,
            },
        });

        const response = mutation.data.delogMutationRecord;

        if (!response.status) {
            console.log('Could not record to delog. Something went wrong.');
            return;
        }

        console.log(`Recorded to delog.`);

        return;
    } catch (error) {
        console.log('Could not record to delog. Something went wrong.');
        return;
    }
}
// #endregion module



// #region exports
export default record;
// #endregion exports
