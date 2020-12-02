// #region imports
    // #region external
    import {
        Context,
        InputOf,
        InputValueString,
        InputGenerateToken,
    } from '~server/data/interfaces';

    import {
        Tokens,
    } from '~server/api/models';
    // #endregion external
// #endregion imports



// #region exports
export default {
    generateToken: (
        _: any,
        { input }: InputOf<InputGenerateToken>,
        context: Context,
    ) => Tokens.Mutation.generateToken(
        input,
        context,
    ),
    obliterateToken: (
        _: any,
        { input }: InputOf<InputValueString>,
        context: Context,
    ) => Tokens.Mutation.obliterateToken(
        input,
        context,
    ),
};
// #endregion exports
