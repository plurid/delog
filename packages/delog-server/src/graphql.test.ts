import { expect, it } from 'vitest';
import { executeGraphQL } from './graphql.js';

it('accepts ordinary named and inline fragments', async () => {
  const result = await executeGraphQL(
    {
      query: `
        query Status {
          ...Health
          ... on Query { alias: health }
        }
        fragment Health on Query { health }
      `,
    },
    { health: () => true },
  );
  expect(result.errors).toBeUndefined();
  expect(result.data).toEqual({ health: true, alias: true });
});

it('rejects cyclic and exponentially expanded fragments before execution', async () => {
  await expect(
    executeGraphQL({ query: '{ ...Cycle } fragment Cycle on Query { ...Cycle }' }, {}),
  ).rejects.toThrow('cycles');
  const fragments = Array.from({ length: 10 }, (_, index) => {
    const content = index === 9 ? 'health' : `...F${index + 1} ...F${index + 1}`;
    return `fragment F${index} on Query { ${content} }`;
  });
  await expect(executeGraphQL({ query: `{ ...F0 } ${fragments.join('\n')}` }, {})).rejects.toThrow(
    'complex',
  );
});

it('reports malformed syntax as a client error', async () => {
  await expect(executeGraphQL({ query: '{' }, {})).rejects.toMatchObject({ status: 400 });
});
