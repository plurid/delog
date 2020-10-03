// #region imports
    // #region libraries
    import Koa from 'koa';
    import Router from 'koa-router';
    import bodyParser from 'koa-bodyparser';
    // #endregion libraries
// #endregion imports



// #region module
const PORT = process.env.PORT || 56765;

const main = () => {
    const application = new Koa();
    const router = new Router();

    router.post('/', (context, next) => {
        const body = context.request.body;

        console.log('body', body);

        const response = {
            status: true,
        };
        context.body = JSON.stringify(response);
    });

    application
        .use(bodyParser())
        .use(router.routes())
        .use(router.allowedMethods())
        .listen(PORT, () => {
            console.log(`Delog Notification Receiver started on ${PORT}, http://localhost:${PORT}`);
        });
}

main();
// #endregion module
