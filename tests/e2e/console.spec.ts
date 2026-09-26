import { expect, test } from '@playwright/test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createDelog } from '../../packages/delog-server/build/index.mjs';

test('admin workflow, record filters, keyboard plane reopening, and mobile fallback', async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const response = await request.post('/api/records', {
    headers: { Authorization: 'Bearer e2e-ingestion-token' },
    data: [
      { text: 'Database restored', level: 3, time: Date.now(), unit: 'ms', project: 'api' },
      {
        text: 'Database timed out',
        level: 5,
        time: Date.now() - 1000,
        unit: 'ms',
        project: 'api',
        error: 'Connection deadline exceeded',
      },
    ],
  });
  expect(response.status()).toBe(201);
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Key', exact: true }).fill('wrong-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Incorrect');
  await page.getByRole('textbox', { name: 'Key', exact: true }).fill('e2e-owner-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Records', exact: true })).toBeVisible();
  await expect(page.getByRole('row').filter({ hasText: 'Database restored' })).toBeVisible();

  const recordRow = page.getByRole('row').filter({ hasText: 'Connection deadline exceeded' });
  const explore = recordRow.getByText('Explore', { exact: true });
  await explore.focus();
  await explore.press('Enter');
  await expect(
    page.getByRole('heading', { name: 'Database timed out', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Close plane', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Close plane', exact: true })).toHaveCount(0);
  await explore.click();
  await expect(
    page.getByRole('heading', { name: 'Database timed out', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Close plane', exact: true }).click();

  await page.getByRole('link', { name: 'Switch to list view' }).click();
  await page.getByRole('button', { name: 'Projects', exact: true }).click();
  await page.getByRole('button', { name: 'Create project', exact: true }).click();
  await page.getByRole('textbox', { name: 'Name', exact: true }).fill('api');
  await page.locator('form').getByRole('button', { name: 'Create project', exact: true }).click();
  await expect(page.getByRole('list')).toContainText('api');
  await page.getByRole('button', { name: 'Testers', exact: true }).click();
  await page.getByRole('button', { name: 'Create tester', exact: true }).click();
  await page.getByRole('textbox', { name: 'Name', exact: true }).fill('request');
  await page.getByRole('combobox', { name: 'Project', exact: true }).selectOption('api');
  await page.getByRole('textbox', { name: 'Suite', exact: true }).fill('requests');
  await page.getByRole('textbox', { name: 'Scenario', exact: true }).fill('success');
  await page.locator('form').getByRole('button', { name: 'Create tester', exact: true }).click();
  await page.getByRole('button', { name: 'Edit request', exact: true }).click();
  await page.getByRole('textbox', { name: 'Name', exact: true }).fill('updated request');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Edit updated request', exact: true }),
  ).toBeVisible();

  await page.getByRole('button', { name: 'Tokens', exact: true }).click();
  await page.getByRole('button', { name: 'Create token', exact: true }).click();
  await page.getByRole('textbox', { name: 'Name', exact: true }).fill('worker');
  await page.locator('form').getByRole('button', { name: 'Create token', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Save your ingestion token', exact: true }),
  ).toBeVisible();

  await page.getByRole('button', { name: 'Records', exact: true }).click();
  await page.getByRole('searchbox', { name: 'Search records' }).fill('does-not-exist');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.getByText('No matching records', { exact: true })).toBeVisible();
  await page.getByRole('searchbox', { name: 'Search records' }).fill('timed out');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.getByRole('row').filter({ hasText: 'Database restored' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Inspect', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Database timed out', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Close details', exact: true }).click();
  await page.getByRole('checkbox', { name: 'Select Database timed out', exact: true }).check();
  await page.getByRole('button', { name: 'Delete 1 selected', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('searchbox', { name: 'Search records' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('public readers can enter administration through an explicit sign-in', async ({ page }) => {
  const dataRoot = mkdtempSync(join(tmpdir(), 'delog-public-ui-'));
  const application = createDelog({
    dataRoot,
    port: 0,
    mode: 'public',
    retentionDays: 0,
    owner: { identonym: 'owner', key: 'public-admin-password' },
  });
  try {
    const url = await application.start();
    await page.goto(url + '/?view=list');
    await expect(page.getByRole('button', { name: 'Projects', exact: true })).toHaveCount(0);
    await page.getByRole('button', { name: 'Administrator sign in', exact: true }).click();
    await page.getByRole('textbox', { name: 'Key', exact: true }).fill('public-admin-password');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Projects', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Sign out', exact: true }).click();
    await expect(
      page.getByRole('button', { name: 'Administrator sign in', exact: true }),
    ).toBeVisible();
  } finally {
    await application.close();
    rmSync(dataRoot, { recursive: true, force: true });
  }
});
