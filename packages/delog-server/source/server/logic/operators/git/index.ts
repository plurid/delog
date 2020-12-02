// #region imports
    // #region libraries
    import {
        exec,
    } from 'child_process';

    import path from 'path';
    // #endregion libraries


    // #region external
    import {
        BASE_PATH,
    } from '~server/data/constants';
    // #endregion external
// #endregion imports



// #region module
const gitLastCommit = async (
    repositoryPath: string,
) => {
    try {
        const repositoryFullPath = path.join(
            BASE_PATH,
            repositoryPath,
        );

        const gitLog = `git log --format="%H" -n 1`;

        const data: string = await new Promise((resolve, reject) => {
            exec(gitLog, {
                cwd: repositoryFullPath,
            }, (error, stdout) => {
                if (error) {
                    reject('');
                }

                resolve(stdout.trim());
            });
        });

        return data;
    } catch (error) {
        return '';
    }
}


const gitShowFile = async (
    repositoryPath: string,
    commit: string,
    file: string,
) => {
    try {
        const repositoryFullPath = path.join(
            BASE_PATH,
            repositoryPath,
        );

        const gitShow = `git show ${commit}:${file}`;

        const data: string = await new Promise((resolve, reject) => {
            exec(gitShow, {
                cwd: repositoryFullPath,
            }, (error, stdout) => {
                if (error) {
                    reject('');
                }

                resolve(stdout);
            });
        });

        return data;
    } catch (error) {
        return '';
    }
}
// #endregion module



// #region exports
export {
    gitLastCommit,
    gitShowFile,
};
// #endregion exports
