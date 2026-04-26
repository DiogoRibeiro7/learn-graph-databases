import { createDriver } from "../db/driver.js";
import { formatNeo4jErrorMessage } from "../db/errors.js";
import { logger } from "../logging/logger.js";
import { isSeedDomain, listSeedDefinitions, runSeedDomain, type SeedDomain } from "../seeds/framework.js";

type SeedCliOptions = Readonly<{
  domain?: string;
  list: boolean;
  clear: boolean;
  help: boolean;
}>;

function parseArgs(args: string[]): SeedCliOptions {
  let domain: string | undefined;
  let list = false;
  let clear = false;
  let help = false;

  for (const arg of args) {
    if (arg === "--list" || arg === "-l") {
      list = true;
      continue;
    }
    if (arg === "--clear" || arg === "-c") {
      clear = true;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      help = true;
      continue;
    }
    if (!arg.startsWith("-") && !domain) {
      domain = arg;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  return { domain, list, clear, help };
}

function printUsage(): void {
  console.log("Usage: yarn seed -- <domain> [--clear]");
  console.log("       yarn seed -- --list");
  console.log("");
  console.log("Domains:");
  for (const definition of listSeedDefinitions()) {
    console.log(`  ${definition.domain} - ${definition.description}`);
  }
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));

  if (options.help || options.list) {
    printUsage();
    return;
  }

  if (!options.domain) {
    throw new Error("Missing seed domain. Run with --list to view available domains.");
  }

  if (!isSeedDomain(options.domain)) {
    throw new Error(`Unknown seed domain: ${options.domain}`);
  }

  const domain: SeedDomain = options.domain;
  const driver = createDriver();

  try {
    await runSeedDomain(driver, domain, { clearBeforeSeed: options.clear });
  } finally {
    await driver.close();
  }
}

if (import.meta.main) {
  main().catch((error: unknown) => {
    logger.error("Failed to run seed framework.", {
      error: error instanceof Error ? formatNeo4jErrorMessage(error) : String(error),
    });
    process.exitCode = 1;
  });
}
