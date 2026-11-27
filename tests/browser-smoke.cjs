const assert = require("node:assert/strict");
const path = require("node:path");
const { chromium } = require("playwright");

(async function run() {
  let browser;
  let page;

  try {
    browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
    page = await browser.newPage({ acceptDownloads: true });

    page.on("pageerror", error => {
      console.error("[browser page error]", error.message);
    });
    page.on("console", message => {
      if (message.type() === "error") console.error("[browser console]", message.text());
    });
    page.on("requestfailed", request => {
      console.error("[request failed]", request.url(), request.failure()?.errorText || "");
    });
    page.on("response", response => {
      if (response.status() >= 400) {
        console.error("[HTTP error]", response.status(), response.url());
      }
    });

    const response = await page.goto(
      "http://127.0.0.1:4173/Fit-Privacy-Cleaner/",
      { waitUntil: "networkidle", timeout: 60000 }
    );
    assert.ok(response && response.ok(), "Cleaner page did not load.");

    await page.waitForFunction(() => {
      const element = document.getElementById("runtimeStatus");
      return element && (
        element.classList.contains("success") ||
        element.classList.contains("error")
      );
    }, null, { timeout: 60000 });

    const runtimeStatus = await page.locator("#runtimeStatus").textContent();
    console.log("Runtime status:", runtimeStatus);
    assert.match(runtimeStatus, /FIT Prozessor bereit/, "Blazor runtime or JS interop did not initialize.");

    const version = await page.locator("#appVersion").textContent();
    const build = await page.locator("#appBuild").textContent();
    console.log("Application version:", version, "Build:", build);
    assert.equal(version, "1.0.4", "Unexpected application version.");

    const fixture = process.env.FIT_TEST_FIXTURE;
    assert.ok(fixture && require("node:fs").existsSync(fixture), "Generated FIT fixture is missing.");

    await page.locator("#fileInput").setInputFiles(path.resolve(fixture));
    await page.waitForFunction(
      () => {
        const button = document.getElementById("analyzeButton");
        return button && !button.disabled;
      },
      null,
      { timeout: 30000 }
    );

    await page.locator("#analyzeButton").click();
    await page.waitForFunction(
      () => {
        const status = document.getElementById("status");
        return status && (
          status.classList.contains("success") ||
          status.classList.contains("error")
        );
      },
      null,
      { timeout: 75000 }
    );

    const analyzeStatus = await page.locator("#status").textContent();
    console.log("Analyze status:", analyzeStatus);
    assert.match(analyzeStatus, /Analyse erfolgreich/, "Browser FIT analysis failed.");

    const statistics = await page.locator("#stats .stat strong").allTextContents();
    assert.equal(statistics[0], "1", "Expected one FIT record in browser analysis.");
    console.log("FIT analysis result:", statistics.join(", "));

    const downloadPromise = page.waitForEvent("download", { timeout: 30000 });
    await page.locator("#cleanButton").click();
    const download = await downloadPromise;
    console.log("Cleaned FIT download:", download.suggestedFilename());
    assert.match(download.suggestedFilename(), /_anonymized\.fit$/);

    console.log("Browser end to end FIT smoke test passed.");
  } catch (error) {
    if (page) {
      await page.screenshot({
        path: "artifacts/browser-smoke-failure.png",
        fullPage: true
      }).catch(() => {});
      const status = await page.locator("#runtimeStatus").textContent().catch(() => "unavailable");
      console.error("Runtime status at failure:", status);
    }
    console.error(error);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
  }
})();
