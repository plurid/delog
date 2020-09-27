// #region imports
    // #region external
    import {
        Context,
        InputOf,
        InputValueString,
    } from '#server/data/interfaces';

    import {
        Notifiers,
    } from '#server/api/models';
    // #endregion external
// #endregion imports



// #region exports
export default {
    generateNotifier: (
        _: any,
        { input }: InputOf<InputValueString>,
        context: Context,
    ) => Notifiers.Mutation.generateNotifier(
        input,
        context,
    ),
    obliterateNotifier: (
        _: any,
        { input }: InputOf<InputValueString>,
        context: Context,
    ) => Notifiers.Mutation.obliterateNotifier(
        input,
        context,
    ),
};
// #endregion exports
