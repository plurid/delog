// #region imports
    // #region external
    import {
        Database,
    } from '#server/data/interfaces';

    import {
        OPTIMIZATION_BATCH_WRITE_SIZE,
        OPTIMIZATION_BATCH_WRITE_TIME,
    } from '#server/data/constants';
    // #endregion external
// #endregion imports



// #region module
export interface BatcherOptions {
    size: number;
    time: number;
}

class Batcher<T> {
    private batch: T[] = [];
    private options: BatcherOptions;
    private entity: string;
    private database: Database;

    constructor(
        entity: string,
        database: Database,
    ) {
        this.options = {
            size: OPTIMIZATION_BATCH_WRITE_SIZE,
            time: OPTIMIZATION_BATCH_WRITE_TIME,
        };

        this.entity = entity;
        this.database = database;

        setInterval(
            this.store,
            this.options.time,
        );
    }

    push(
        data: T,
    ) {
        if (this.batch.length < this.options.size) {
            this.batch.push(data);
            return;
        }

        this.store();
    }

    async store() {
        if (!this.database) {
            return;
        }

        if (this.batch.length === 0) {
            return;
        }

        await this.database.storeBatch(
            this.entity,
            this.batch,
        );

        this.batch = [];
    }
}
// #endregion module


// #region exports
export default Batcher;
// #endregion exports
