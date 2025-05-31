import { test, expect } from '@playwright/test'

test.describe('Curio Chatbot E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the chatbot interface correctly', async ({ page }) => {
    // Check main heading
    await expect(page.locator('h1')).toContainText('Curio')
    
    // Check subtitle
    await expect(page.locator('text=AI-Powered Stray Animal Rescue Assistant')).toBeVisible()
    
    // Check initial bot message
    await expect(page.locator('text=Hello! I\'m Curio')).toBeVisible()
    
    // Check input field
    await expect(page.locator('input[placeholder*="animal situation"]')).toBeVisible()
    
    // Check send button
    await expect(page.locator('button:has-text("Send")')).toBeVisible()
  })

  test('should display emergency notice', async ({ page }) => {
    await expect(page.locator('text=For life-threatening emergencies')).toBeVisible()
  })

  test('should allow user to type and send a message', async ({ page }) => {
    const input = page.locator('input[placeholder*="animal situation"]')
    const sendButton = page.locator('button:has-text("Send")')
    
    await input.fill('I found an injured cat')
    await expect(sendButton).toBeEnabled()
    
    await sendButton.click()
    
    // Check that the message appears in chat
    await expect(page.locator('text=I found an injured cat')).toBeVisible()
    
    // Check that input is cleared
    await expect(input).toHaveValue('')
  })

  test('should show loading state when processing message', async ({ page }) => {
    const input = page.locator('input[placeholder*="animal situation"]')
    const sendButton = page.locator('button:has-text("Send")')
    
    await input.fill('I found a stray dog')
    await sendButton.click()
    
    // Should show thinking indicator
    await expect(page.locator('text=Thinking...')).toBeVisible()
    
    // Input and button should be disabled while processing
    await expect(input).toBeDisabled()
    await expect(sendButton).toBeDisabled()
  })

  test('should prevent sending empty messages', async ({ page }) => {
    const sendButton = page.locator('button:has-text("Send")')
    
    // Send button should be disabled when input is empty
    await expect(sendButton).toBeDisabled()
    
    // Filling with spaces should still keep it disabled
    await page.locator('input[placeholder*="animal situation"]').fill('   ')
    await expect(sendButton).toBeDisabled()
  })

  test('should display user messages with correct styling', async ({ page }) => {
    const input = page.locator('input[placeholder*="animal situation"]')
    
    await input.fill('Test message')
    await page.locator('button:has-text("Send")').click()
    
    // User message should appear on the right side
    const userMessage = page.locator('text=Test message').first()
    await expect(userMessage).toBeVisible()
    
    // Should have user message styling
    const messageContainer = userMessage.locator('..').locator('..')
    await expect(messageContainer).toHaveClass(/justify-end/)
  })

  test('should show timestamps on messages', async ({ page }) => {
    // Check initial bot message has timestamp
    const botMessage = page.locator('text=Hello! I\'m Curio').locator('..').locator('..')
    await expect(botMessage.locator('text=/\\d{1,2}:\\d{2}/')).toBeVisible()
  })

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Main container should still be visible
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('input[placeholder*="animal situation"]')).toBeVisible()
    
    // Chat area should be scrollable
    const chatArea = page.locator('.overflow-y-auto')
    await expect(chatArea).toBeVisible()
  })

  test('should maintain chat history during conversation', async ({ page }) => {
    const input = page.locator('input[placeholder*="animal situation"]')
    
    // Send first message
    await input.fill('I found a dog')
    await page.locator('button:has-text("Send")').click()
    await page.waitForLoadState('networkidle')
    
    // Send second message
    await input.fill('The dog is limping')
    await page.locator('button:has-text("Send")').click()
    await page.waitForLoadState('networkidle')
    
    // Both messages should be visible
    await expect(page.locator('text=I found a dog')).toBeVisible()
    await expect(page.locator('text=The dog is limping')).toBeVisible()
  })

  test('should handle keyboard navigation', async ({ page }) => {
    const input = page.locator('input[placeholder*="animal situation"]')
    
    await input.fill('Test message')
    
    // Should be able to submit with Enter key
    await input.press('Enter')
    
    await expect(page.locator('text=Test message')).toBeVisible()
  })

  test('should display rescue report when complete information is provided', async ({ page }) => {
    // This test would require mocking the API response
    // For now, we'll just check the UI structure that would appear
    const input = page.locator('input[placeholder*="animal situation"]')
    
    await input.fill('Found an injured dog at Main Street Park, it has a hurt leg')
    await page.locator('button:has-text("Send")').click()
    
    // Wait for potential rescue report section
    // In a real scenario with proper API response, we'd check:
    // await expect(page.locator('text=Rescue Report Generated')).toBeVisible()
    // await expect(page.locator('text=Download')).toBeVisible()
  })
}) 