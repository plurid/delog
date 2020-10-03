// #region imports
    // #region libraries
    import {
        promises as fs,
    } from 'fs';
    import path from 'path';

    import Deon from '@plurid/deon';
    // #endregion libraries
// #endregion imports



// #region module
const resolveFilepath = (
    file: string,
) => {
    const filepath = path.isAbsolute(file)
        ? file
        : path.join(process.cwd(), file);

    return filepath;
}


const parseFile = async (
    filepath: string,
) => {
    const data = await fs.readFile(filepath, 'utf-8');
    const deon = new Deon();
    const parsed = await deon.parse(data);

    return parsed;
}
// #endregion module



// #region exports
export {
    resolveFilepath,
    parseFile,
};
// #endregion exports
