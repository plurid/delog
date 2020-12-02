// #region imports
    // #region external
    import {
        Context,
        InputOf,
        InputLinkRepository,
        InputValueString,
    } from '~server/data/interfaces';

    import {
        Repositories,
    } from '~server/api/models';
    // #endregion external
// #endregion imports



// #region exports
export default {
    linkRepository: (
        _: any,
        { input }: InputOf<InputLinkRepository>,
        context: Context,
    ) => Repositories.Mutation.linkRepository(
        input,
        context,
    ),
    delinkRepository: (
        _: any,
        { input }: InputOf<InputValueString>,
        context: Context,
    ) => Repositories.Mutation.delinkRepository(
        input,
        context,
    ),
};
// #endregion exports
