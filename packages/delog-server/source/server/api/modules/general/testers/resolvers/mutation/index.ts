// #region imports
    // #region external
    import {
        Context,
        InputOf,
        InputGenerateTester,
        InputValueString,
    } from '~server/data/interfaces';

    import {
        Testers,
    } from '~server/api/models';
    // #endregion external
// #endregion imports



// #region exports
export default {
    generateTester: (
        _: any,
        { input }: InputOf<InputGenerateTester>,
        context: Context,
    ) => Testers.Mutation.generateTester(
        input,
        context,
    ),
    obliterateTester: (
        _: any,
        { input }: InputOf<InputValueString>,
        context: Context,
    ) => Testers.Mutation.obliterateTester(
        input,
        context,
    ),
};
// #endregion exports
