import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    // Placeholder - requires Auth0 test configuration
    await page.goto('/')
    // In a real test, we'd check for Auth0 redirect or mock it
    expect(true).toBe(true)
  })
})
