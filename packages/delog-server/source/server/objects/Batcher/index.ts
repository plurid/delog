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
    private interval: number = 0;
    private hits = 0;

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

        setInterval(() => {
            console.log('hits', this.hits);
        }, 1000);
    }

    push(
        data: T,
    ) {
        this.hits += 1;
        console.log('hits', this.hits);

        this.batch.push(data);

        if (!this.interval) {
            this.interval = setInterval(
                () => this.store(),
                this.options.time,
            );
        }
    }

    async store() {
        if (!this.database) {
            return;
        }

        if (this.batch.length === 0) {
            clearInterval(this.interval);
            this.interval = 0;

            return;
        }

        const size = this.batch.length < this.options.size
            ? this.batch.length
            : this.options.size;

        const batch = this.batch.slice(0, size);
        console.log('batch.length', batch.length);

        console.log('this.batch Pre', this.batch.length);
        this.batch = this.batch.slice(size);
        console.log('this.batch Post', this.batch.length);

        await this.database.storeBatch(
            this.entity,
            batch,
        );
    }
}
// #endregion module


// #region exports
export default Batcher;
// #endregion exports
