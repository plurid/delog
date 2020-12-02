// #region imports
    // #region external
    import {
        Context,
        InputOf,
        InputGenerateFormat,
        InputValueString,
    } from '~server/data/interfaces';

    import {
        Formats,
    } from '~server/api/models';
    // #endregion external
// #endregion imports



// #region exports
export default {
    generateFormat: (
        _: any,
        { input }: InputOf<InputGenerateFormat>,
        context: Context,
    ) => Formats.Mutation.generateFormat(
        input,
        context,
    ),
    obliterateFormat: (
        _: any,
        { input }: InputOf<InputValueString>,
        context: Context,
    ) => Formats.Mutation.obliterateFormat(
        input,
        context,
    ),
};
// #endregion exports
