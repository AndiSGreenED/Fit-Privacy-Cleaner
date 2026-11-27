# Deployment

## 1. GitHub Pages Website

The GitHub Actions workflow `.github/workflows/pages.yml` publishes the `frontend` directory.

In the repository settings, open **Pages** and set **Build and deployment** to **GitHub Actions** if it is not already selected.

The website URL is:

https://andisgreened.github.io/Fit-Privacy-Cleaner/

## 2. Cloudflare API

The API runs in a .NET 10 container behind a Cloudflare Worker. The Worker configuration is in `wrangler.jsonc`, the request router is in `src/index.js`, and the container build is in the root `Dockerfile`.

In Cloudflare:

1. Open **Workers & Pages**.
2. Create a Worker or choose **Connect to Git** for a new Worker.
3. Select the GitHub repository `AndiSGreenED/Fit-Privacy-Cleaner`.
4. Set the production branch to `main`.
5. Set the root directory to the repository root.
6. Use the normal dependency installation command `npm install`.
7. Set the deploy command to `npx wrangler deploy`.
8. Save and deploy.

The Cloudflare Workers Builds GitHub App must be installed for this repository. If the repository is missing, extend that GitHub App installation to include `Fit-Privacy-Cleaner`.

The Worker name in `wrangler.jsonc` is `fit-privacy-cleaner-api`. With the existing account subdomain `andigreen`, the expected API origin is:

https://fit-privacy-cleaner-api.andigreen.workers.dev

After deployment, verify:

- Open `/api/health` and confirm a JSON response with `status: ok`.
- Load the GitHub Pages website.
- Analyze and clean a real FIT file.
- Confirm the cleaned file opens in Garmin Connect or another FIT compatible tool.

## 3. Security and production validation

The API allows browser requests only from the SurfsApp GitHub Pages origin and local development origins. FIT uploads are processed in memory and are not written to an application database.

Automated tests use generated FIT data. They do not replace end to end testing with real activities from different Garmin devices and sports.
