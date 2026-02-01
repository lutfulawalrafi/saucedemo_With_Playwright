import { expect } from '@playwright/test';

    export class Assertions {
        
    async verifyByText(items){
        for (const item of items) {
            await expect(item.locator).toContainText(item.text);
        }
    }
}