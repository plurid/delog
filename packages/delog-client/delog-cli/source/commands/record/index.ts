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
        const delog = await getDelog();

        if (!delog) {
            console.log('Could record to delog. Not logged in.');
            return;
        }

        const input = {
            format: '%TIME %TEXT',

            project: '',
            space: '',

            level: 0,
            method: '',
            sharedID: '',
            sharedOrder: 0,
            error: '',
            extradata: '',

            context: {

            },

            text: data.text,

            time: 0,
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
