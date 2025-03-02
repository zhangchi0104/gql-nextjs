import { test, expect, Page } from "@playwright/test";
enum AustralianState {
  Nsw = "NSW",
  Vic = "VIC",
  Qld = "QLD",
  Act = "ACT",
  Sa = "SA",
  Wa = "WA",
  Tas = "TAS",
}
const fillForm = async (
  page: Page,
  {
    state,
    suburb,
    postcode,
  }: {
    state?: AustralianState;
    suburb?: string;
    postcode?: string;
  },
) => {
  if (state) {
    await page.getByTestId("locality-form__state").selectOption(state);
  }
  if (suburb) {
    await page.getByTestId("locality-form__suburb").fill(suburb);
  }
  if (postcode) {
    await page.getByTestId("locality-form__postcode").fill(postcode);
  }
  await page.getByTestId("locality-form__submit").click();
};
const signIn = async (page: Page) => {
  await page.getByTestId("login__username").fill("test");
  await page.getByTestId("login__password").fill("test");
  await page.getByTestId("login__submit").click();
};
test("should be able to sign in", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await signIn(page);
  // wait for the page to load
  await page.waitForLoadState("domcontentloaded");
  await expect(page.getByTestId("locality-form__form")).toBeVisible();
});
test("should show error for wrong password", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  // await signIn(page);
  // wait for the page to load
  await page.getByTestId("login__username").fill("test");
  await page.getByTestId("login__password").fill("wrong");
  await page.getByTestId("login__submit").click();
  await page.waitForTimeout(1000);
  await expect(page.getByRole("heading", { name: "Error" })).toBeVisible();
});

test.describe("should be able to submit a locality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await signIn(page);
  });

  test("should show error submitting a blank form", async ({ page }) => {
    await fillForm(page, {});
    await page.waitForTimeout(1000);

    await expect(page.getByTestId("locality-form__suburb-error")).toBeVisible();
    await expect(
      page.getByTestId("locality-form__postcode-error"),
    ).toBeVisible();
    await expect(page.getByTestId("locality-form__state-error")).toBeVisible();
  });

  test("should show error if postcode is not 4 digits", async ({ page }) => {
    await fillForm(page, {
      state: AustralianState.Vic,
      suburb: "Melbourne",
      postcode: "200",
    });
    await page.waitForTimeout(1000);
    await expect(
      page.getByTestId("locality-form__postcode-error"),
    ).toBeVisible();
  });

  test("should show error if there is a mismatch between post code and suburb", async ({
    page,
  }) => {
    await fillForm(page, {
      state: AustralianState.Vic,
      suburb: "Melbourne",
      postcode: "1000",
    });
    await page.waitForTimeout(1000);
    await expect(
      page.getByTestId("locality-form__verification-result"),
    ).toContainText("postcode 1000 does not match the suburb Melbourne");
  });

  test("should show error if there is a mismatch between suburb and state", async ({
    page,
  }) => {
    await fillForm(page, {
      state: AustralianState.Vic,
      suburb: "Sydney",
      postcode: "2000",
    });
    await page.waitForTimeout(1000);
    await expect(
      page.getByTestId("locality-form__verification-result"),
    ).toContainText("Suburb Sydney does not exist in VIC");
  });

  test("should show success message if the locality is valid", async ({
    page,
  }) => {
    await fillForm(page, {
      state: AustralianState.Vic,
      suburb: "Melbourne",
      postcode: "3000",
    });
    await page.waitForTimeout(1000);
    await expect(
      page.getByTestId("locality-form__verification-result"),
    ).toContainText("the postcode, suburb, and state input are valid");
  });
});
