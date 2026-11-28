const assert = require("node:assert/strict");
const path = require("node:path");
const { chromium } = require("playwright");

(async function run() {
  let browser;
  let page;
  try {
    browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
    page = await browser.newPage({ acceptDownloads: true, locale: "de-DE" });
    page.on("pageerror", error => console.error("[browser page error]", error.message));
    page.on("console", message => { if (message.type() === "error") console.error("[browser console]", message.text()); });
    page.on("requestfailed", request => console.error("[request failed]", request.url(), request.failure()?.errorText || ""));
    page.on("response", response => { if (response.status() >= 400) console.error("[HTTP error]", response.status(), response.url()); });

    const response = await page.goto("http://127.0.0.1:4173/Fit-Privacy-Cleaner/", { waitUntil: "networkidle", timeout: 60000 });
    assert.ok(response && response.ok(), "Cleaner page did not load.");
    await page.waitForFunction(() => document.getElementById("runtimeStatus")?.classList.contains("success"), null, { timeout: 60000 });
    assert.match(await page.locator("#runtimeStatus").textContent(), /FIT Prozessor bereit/);
    assert.equal(await page.locator("#removeDevice").isVisible(), true);
    assert.equal(await page.locator("#removeGps").isVisible(), true);
    assert.match(await page.locator("#privacyPreviewText").textContent(), /ausgewählten Bereiche/);
    assert.match(await page.locator(".always-strip").textContent(), /Immer entfernt/);
    assert.equal(await page.locator("#removeGps").isChecked(), false);
    for (const id of ["removeHeartRate","removePower","removeCadence","removeDeveloper"]) {
      assert.equal(await page.locator("#" + id).isVisible(), true, id + " privacy choice is missing.");
    }
    assert.equal(await page.locator("#removeDeveloper").isChecked(), false, "Custom app fields must be preserved by default.");

    const fixture = process.env.FIT_TEST_FIXTURE;
    assert.ok(fixture && require("node:fs").existsSync(fixture), "Generated FIT fixture is missing.");
    await Promise.all([
      page.waitForURL(/release-1\.2\.0\/index\.en\.html/),
      page.locator('.language-switch a[href$="index.en.html"]').click()
    ]);
    await page.waitForFunction(() => document.documentElement.lang === "en" && document.getElementById("runtimeStatus")?.classList.contains("success"), null, { timeout: 60000 });
    assert.equal(await page.locator("#upload-title").textContent(), "Select FIT file");
    assert.equal(await page.locator("#appVersion").textContent(), "1.2.0");

    await page.locator("#fileInput").setInputFiles(path.resolve(fixture));
    await page.waitForFunction(() => document.getElementById("status")?.textContent?.includes("File selected"), null, { timeout: 10000 });
    assert.equal(await page.locator("#results").evaluate(element => element.classList.contains("visible")), false, "Selecting a FIT file must not start analysis.");
    assert.equal(await page.locator("#analyzeButton").isEnabled(), true);
    await page.locator("#removeGps").check();
    assert.equal(await page.locator("#removeGps").isChecked(), true);
    assert.match(await page.locator("#privacyPreviewList").textContent(), /GPS coordinates/);
    assert.match(await page.locator("#privacySection").textContent(), /Location and route data/);
    await page.locator("#removeGps").uncheck();
    await page.locator("#removeDeveloper").check();
    assert.match(await page.locator("#privacyPreviewList").textContent(), /App and custom fields/);
    await page.locator("#removeDeveloper").uncheck();
    for (const id of ["removeHeartRate","removePower","removeCadence"]) await page.locator("#" + id).check();
    assert.match(await page.locator("#privacyPreviewList").textContent(), /Heart rate/);
    assert.match(await page.locator("#privacyPreviewList").textContent(), /Power/);
    assert.match(await page.locator("#privacyPreviewList").textContent(), /Cadence/);

    await page.locator("#analyzeButton").click();
    await page.waitForFunction(() => document.getElementById("results")?.classList.contains("visible"), null, { timeout: 75000 });
    assert.match(await page.locator("#analysisExplanation").textContent(), /What this analysis means/);
    assert.match(await page.locator("#analysisExplanation").textContent(), /Heart rate/);
    assert.match(await page.locator("#analysisExplanation").textContent(), /jump values/);
    assert.equal(await page.locator(".analysis-kept").count(), 0, "The repeated training data preservation paragraph should be gone.");
    assert.equal(await page.locator("#cleanButton").isEnabled(), true);

    await page.locator("#cleanButton").click();
    await page.waitForFunction(() => document.getElementById("cleanedPanel") && !document.getElementById("cleanedPanel").hidden, null, { timeout: 75000 });
    assert.match(await page.locator("#cleanSummaryText").textContent(), /Nothing has been uploaded/);
    assert.equal(await page.locator("#downloadButton").isEnabled(), true);
    assert.equal(await page.locator("#donateSport").isVisible(), true);
    assert.equal(await page.locator("#sendFitButton").isDisabled(), true);
    assert.equal(await page.locator("#donateConsent").count(), 0, "The separate consent checkbox should be removed.");
    assert.equal(await page.locator("#donateName").getAttribute("required"), null);
    assert.equal(await page.locator("#donateContact").getAttribute("required"), null);
    assert.match(await page.locator("#donateForm").textContent(), /Name and email are optional/);

    const downloadPromise = page.waitForEvent("download", { timeout: 30000 });
    await page.locator("#downloadButton").click();
    const download = await downloadPromise;
    assert.match(download.suggestedFilename(), /_anonymized\.fit$/);

    await page.route("https://garmin-abruf.andigreen.workers.dev/api/fit-submissions", async route => {
      const body = route.request().postData() || "";
      assert.doesNotMatch(body, /Test User/);
      assert.match(body, /Windsurfen/);
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ id: "smoke-test" }) });
    });
    await page.locator("#donateSport").selectOption("Windsurfen");
    await page.locator("#sendFitButton").click();
    await page.waitForFunction(() => document.getElementById("sendStatus")?.classList.contains("success"), null, { timeout: 15000 });
    assert.match(await page.locator("#sendStatus").textContent(), /sent to SurfsApp development/);

    const versioned = await page.goto("http://127.0.0.1:4173/Fit-Privacy-Cleaner/release-1.2.0/?lang=de", { waitUntil: "networkidle", timeout: 60000 });
    assert.ok(versioned && versioned.ok(), "Version 1.1.0 page did not load.");
    await page.waitForFunction(() => document.getElementById("runtimeStatus")?.classList.contains("success"), null, { timeout: 60000 });
    await page.waitForFunction(() => document.getElementById("appBuild")?.textContent?.includes("Run"), null, { timeout: 15000 });
    assert.equal(await page.locator("#appVersion").textContent(), "1.1.0");
    assert.equal(await page.locator("#removeGps").isVisible(), true);
    assert.equal(await page.locator("#analyzeButton").isDisabled(), true);
    console.log("FIT Privacy Cleaner 1.2.0 browser end-to-end tests passed.");
  } catch (error) {
    if (page) {
      await page.screenshot({ path: "artifacts/browser-smoke-failure.png", fullPage: true }).catch(() => {});
      console.error("Runtime status at failure:", await page.locator("#runtimeStatus").textContent().catch(() => "unavailable"));
    }
    console.error(error);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
  }
})();