import { test, expect } from '@playwright/test';

test.describe('Task management', () => {
  test('user can add a new task', async ({ page }) => {
    await page.goto('/');

    const input = page.getByPlaceholder('Describe the task...');
    const addButton = page.getByRole('button', { name: /add task/i });

    await input.fill('Buy milk');
    await addButton.click();

    // Ensure exactly one matching table cell is visible
    const cell = page.getByRole('cell', { name: 'Buy milk' }).first();
    await expect(cell).toBeVisible();
  });

  test('user can delete a task', async ({ page }) => {
    await page.goto('/');

    const input = page.getByPlaceholder('Describe the task...');
    const addButton = page.getByRole('button', { name: /add task/i });

    const taskText = 'Task to delete';
    await input.fill(taskText);
    await addButton.click();
    await expect(page.getByText(taskText)).toBeVisible();

    const row = page.getByRole('row', { name: new RegExp(taskText) });
    const deleteButton = row.getByRole('button');
    await deleteButton.click();

    await expect(page.getByText(taskText)).not.toBeVisible();
  });
});


