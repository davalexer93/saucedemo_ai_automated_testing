import { test as base } from '@playwright/test';

type MyFixture ={
    fixtures: void;
}

export const test = base.extend<MyFixture>({
    fixtures: async ({page}, use) => {
        await page.goto('/');
        await use()
        await page.getByRole('button',{name: 'Open Menu'}).click()
        await page.getByRole('button',{name: 'Logout'}).click()
    }
})
