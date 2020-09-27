// #region imports
    // #region external
    import {
        databaseType,
    } from '#server/data/constants';

    import {
        DatabaseType,
    } from '#server/data/interfaces';
    // #endregion external


    // #region internal
    import filesystemDatabase from './filesystem';
    import amazonDatabase from './amazon';
    import googleDatabase from './google';
    import mongoDatabase from './mongo';
    // #endregion internal
// #endregion imports



// #region module
class Database {
    private type: DatabaseType;

    constructor(
        type: DatabaseType,
    ) {
        this.type = type;
    }

    public get(
        entity: string,
        id: string,
    ) {
        switch (this.type) {
            case databaseType.filesystem:
                return filesystemDatabase.get(
                    entity,
                    id,
                );
            case databaseType.amazon:
                return amazonDatabase.get(
                    entity,
                    id,
                );
            case databaseType.google:
                return googleDatabase.get(
                    entity,
                    id,
                );
            case databaseType.mongo:
                return mongoDatabase.get(
                    entity,
                    id,
                );
            default:
                return;
        }
    }

    public getAll(
        entity: string,
    ) {
        switch (this.type) {
            case databaseType.filesystem:
                return filesystemDatabase.getAll(
                    entity,
                );
            case databaseType.amazon:
                return amazonDatabase.getAll(
                    entity,
                );
            case databaseType.google:
                return googleDatabase.getAll(
                    entity,
                );
            case databaseType.mongo:
                return mongoDatabase.getAll(
                    entity,
                );
            default:
                return [];
        }
    }

    public query(
        entity: string,
        field: string,
        value: string,
    ) {
        switch (this.type) {
            case databaseType.filesystem:
                return filesystemDatabase.query(
                    entity,
                    field,
                    value,
                );
            case databaseType.amazon:
                return amazonDatabase.query(
                    entity,
                    field,
                    value,
                );
            case databaseType.google:
                return googleDatabase.query(
                    entity,
                    field,
                    value,
                );
            case databaseType.mongo:
                return mongoDatabase.query(
                    entity,
                    field,
                    value,
                );
            default:
                return;
        }
    }

    public store(
        entity: string,
        id: string,
        data: any,
    ) {
        switch (this.type) {
            case databaseType.filesystem:
                return filesystemDatabase.store(
                    entity,
                    id,
                    data,
                );
            case databaseType.amazon:
                return amazonDatabase.store(
                    entity,
                    id,
                    data,
                );
            case databaseType.google:
                return googleDatabase.store(
                    entity,
                    id,
                    data,
                );
            case databaseType.mongo:
                return mongoDatabase.store(
                    entity,
                    id,
                    data,
                );
            default:
                return;
        }
    }

    public update(
        entity: string,
        id: string,
        field: string,
        value: any,
    ) {
        switch (this.type) {
            case databaseType.filesystem:
                return filesystemDatabase.update(
                    entity,
                    id,
                    field,
                    value,
                );
            case databaseType.amazon:
                return amazonDatabase.update(
                    entity,
                    id,
                    field,
                    value,
                );
            case databaseType.google:
                return googleDatabase.update(
                    entity,
                    id,
                    field,
                    value,
                );
            case databaseType.mongo:
                return mongoDatabase.update(
                    entity,
                    id,
                    field,
                    value,
                );
            default:
                return;
        }
    }

    public obliterate(
        entity: string,
        id: string,
    ) {
        switch (this.type) {
            case databaseType.filesystem:
                return filesystemDatabase.obliterate(
                    entity,
                    id,
                );
            case databaseType.amazon:
                return amazonDatabase.obliterate(
                    entity,
                    id,
                );
            case databaseType.google:
                return googleDatabase.obliterate(
                    entity,
                    id,
                );
            case databaseType.mongo:
                return mongoDatabase.obliterate(
                    entity,
                    id,
                );
            default:
                return;
        }
    }

    public obliterateAll(
        entity: string,
    ) {
        switch (this.type) {
            case databaseType.filesystem:
                return filesystemDatabase.obliterateAll(
                    entity,
                );
            case databaseType.amazon:
                return amazonDatabase.obliterateAll(
                    entity,
                );
            case databaseType.google:
                return googleDatabase.obliterateAll(
                    entity,
                );
            case databaseType.mongo:
                return mongoDatabase.obliterateAll(
                    entity,
                );
            default:
                return;
        }
    }
}
// #endregion module



// #region exports
export default Database;
// #endregion exports
