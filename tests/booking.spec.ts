import { test, expect } from "@playwright/test";

test.describe("Group Booking Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://group-booking-app-git-main-suriyadevivs-projects.vercel.app/en-GB/booking");
  });

  test("should require mandatory fields", async ({ page }) => {
    await expect(page.locator("text=Contact details")).toBeVisible();

    // Contact Details Section
    await page.locator('[data-testid="Title"]').click();
    await page.keyboard.type("Ms");
    await page.keyboard.press("Enter");

    await page.fill('[placeholder="First Name"]', "Suriyadevi");
    await page.fill('[placeholder="Last Name"]', "Varatharaju");
    await page.fill('[placeholder="Email Address"]', "suriyadevi.v@gmail.com");
    await page.waitForSelector('[aria-label="Phone number"]');
    await page.fill('[aria-label="Phone number"]', "447405309740");

    await page.click('button:text("Continue")');

    // Booking Details Section
    await page.check('[data-testid="bookerType"][value="business"]');
    await page.getByTestId("companyName").fill("Test Company");

    await page.check('[data-testid="stayPurpose"][value="business"]');

    await page.locator('[data-testid="bookingDetails"]').click();
    await page.keyboard.type("Premier Inn London County Hall");
    await page.keyboard.press("Enter");

    // Set check-in and check-out dates
    await page.fill('[data-testid="checkIn"]', "2025-05-20");
    await page.fill('[data-testid="checkOut"]', "2025-05-23");

    await page.click('(//button[text()="Continue"])[2]');

    // Room Details Section
    await page.locator('input[name="familyRoom"]').check();

    await page.locator('input[name="accessibleRoom"]').check();

    await expect(
      page.locator('input[name="familyRoom"]:checked')
    ).toBeVisible();
    await expect(
      page.locator('input[name="accessibleRoom"]:checked')
    ).toBeVisible();

    const plusButton = page.locator('[data-testid="room-single-count"]');
    for (let i = 0; i < 5; i++) {
      await plusButton.click();
    }

    const plusDoubleButton = page.locator('[data-testid="room-double-count"]');
    for (let i = 0; i < 5; i++) {
      await plusDoubleButton.click();
    }

    await expect(
      page.locator(
        'p.text-sm.font-medium.text-gray-700:has-text("Total:") + p.text-sm.font-medium.text-gray-700'
      )
    ).toHaveText("10 Rooms");

    // Submit the form
    await page.locator('form[role="form"] button[type="submit"]').click();
  });
});
