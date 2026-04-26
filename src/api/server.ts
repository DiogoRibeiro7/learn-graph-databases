import express, { type NextFunction, type Request, type Response } from "express";
import { createDriver } from "../db/driver.js";
import { formatNeo4jErrorMessage } from "../db/errors.js";
import { movieQueries, fraudQueries } from "../db/queries.js";
import { runQuery } from "../db/session.js";
import { logger } from "../logging/logger.js";

const app = express();
const driver = createDriver();
const port = Number(process.env.PORT ?? 3000);

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.get("/api/movies", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const genre = String(req.query.genre ?? "Drama");
    const result = await runQuery(driver, movieQueries.moviesByGenre, { genre });

    res.json({
      genre,
      count: result.records.length,
      movies: result.records.map((record) => ({
        movie: record.get("movie"),
        year: record.get("year"),
      })),
    });
  } catch (error: unknown) {
    next(error);
  }
});

app.get("/api/movies/actor/:actor", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const actor = req.params.actor;
    const result = await runQuery(driver, movieQueries.moviesByActor, { actor });

    res.json({
      actor,
      count: result.records.length,
      movies: result.records.map((record) => ({
        movie: record.get("movie"),
        year: record.get("year"),
      })),
    });
  } catch (error: unknown) {
    next(error);
  }
});

app.get("/api/fraud/shared-ip", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await runQuery(driver, fraudQueries.customersSharingIp);

    res.json({
      count: result.records.length,
      suspiciousIps: result.records.map((record) => ({
        ip: record.get("ip"),
        customers: record.get("customers"),
        customerCount: record.get("customerCount"),
      })),
    });
  } catch (error: unknown) {
    next(error);
  }
});

app.get("/api/fraud/card-velocity", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const minOrders = Number(req.query.minOrders ?? 3);
    const maxSeconds = Number(req.query.maxSeconds ?? 1800);

    const result = await runQuery(driver, fraudQueries.highVelocityCards, { minOrders, maxSeconds });

    res.json({
      minOrders,
      maxSeconds,
      count: result.records.length,
      cards: result.records.map((record) => ({
        cardHash: record.get("cardHash"),
        orderCount: record.get("orderCount"),
        firstSeen: record.get("firstSeen"),
        lastSeen: record.get("lastSeen"),
        spanSeconds: record.get("spanSeconds"),
      })),
    });
  } catch (error: unknown) {
    next(error);
  }
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = formatNeo4jErrorMessage(error);
  logger.error("API request failed.", { error: message });
  res.status(500).json({ error: message });
});

const server = app.listen(port, () => {
  logger.info("Demo API server started.", { port });
});

async function shutdown(): Promise<void> {
  logger.info("Shutting down API server.");
  server.close(async () => {
    await driver.close();
    process.exit(0);
  });
}

process.on("SIGINT", () => {
  shutdown().catch((error: unknown) => {
    logger.error("Failed to shut down API cleanly.", {
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  });
});
