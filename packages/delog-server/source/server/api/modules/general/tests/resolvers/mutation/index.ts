// #region imports
    // #region external
    import {
        Context,
        InputOf,
        InputValueString,
        InputObliterateTests,
    } from '~server/data/interfaces';

    import {
        Tests,
    } from '~server/api/models';
    // #endregion external
// #endregion imports



// #region exports
export default {
    obliterateTest: (
        _: any,
        { input }: InputOf<InputValueString>,
        context: Context,
    ) => Tests.Mutation.obliterateTest(
        input,
        context,
    ),
    obliterateTests: (
        _: any,
        { input }: InputOf<InputObliterateTests>,
        context: Context,
    ) => Tests.Mutation.obliterateTests(
        input,
        context,
    ),
};
// #endregion exports
