import { DurableObject } from "cloudflare:workers";

const PORT = 8080;
const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000;

export class Backend extends DurableObject {
  starting;

  constructor(ctx, env) {
    super(ctx, env);
    if (ctx.container.running) {
      void ctx.blockConcurrencyWhile(() =>
        ctx.container.setInactivityTimeout(INACTIVITY_TIMEOUT_MS)
      );
    }
  }

  async fetch(request) {
    this.starting ??= this.startAndWaitForPort().finally(() => {
      this.starting = undefined;
    });
    await this.starting;

    const url = new URL(request.url);
    url.protocol = "http:";
    url.hostname = "container";
    url.port = String(PORT);

    const forwarded = new Request(url, request);
    forwarded.headers.delete("host");

    return this.ctx.container.getTcpPort(PORT).fetch(forwarded);
  }

  async startAndWaitForPort() {
    const container = this.ctx.container;

    if (!container.running) {
      container.start({
        image: container.images.base,
        instance: "lite",
        enableInternet: false
      });
    }

    await container.setInactivityTimeout(INACTIVITY_TIMEOUT_MS);

    const port = container.getTcpPort(PORT);
    let lastError;

    for (let attempt = 0; attempt < 100; attempt++) {
      try {
        const response = await port.fetch("http://container/api/health", {
          signal: AbortSignal.timeout(1000)
        });
        await response.body?.cancel();

        if (!response.ok) {
          throw new Error("FIT Cleaner health check returned " + response.status);
        }

        return;
      } catch (error) {
        lastError = error;
        await scheduler.wait(200);
      }
    }

    throw new Error("FIT Cleaner container did not become ready on port " + PORT, {
      cause: lastError
    });
  }
}

export default {
  fetch(request, env) {
    const pathname = new URL(request.url).pathname;

    if (pathname === "/api" || pathname.startsWith("/api/")) {
      return env.BACKEND.getByName("fit-cleaner-singleton").fetch(request);
    }

    return new Response("Not found", { status: 404 });
  }
};
