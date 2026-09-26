import { createDelogClient } from '@plurid/delog';

const client = createDelogClient({
  project: 'delog',
  space: 'fixtures',
  context: {
    call: {
      repository: {
        provider: process.env.DELOG_REPOSITORY_PROVIDER ?? 'github',
        name: process.env.DELOG_REPOSITORY_NAME ?? 'plurid/delog',
        branch: process.env.DELOG_REPOSITORY_BRANCH ?? 'master',
        basePath: process.cwd(),
      },
    },
  },
});

await client.info({ text: 'Logged from repository example', method: 'repository' });
