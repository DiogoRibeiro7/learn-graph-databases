/**
 * Command-line runner for the starter movie graph queries.
 *
 * This module is intentionally typed and documented so the CLI behavior
 * remains easy to extend and understand.
 */
import type { Record as Neo4jRecord } from "neo4j-driver";
import { createDriver } from "../db/driver.js";
import { runQuery } from "../db/session.js";
import { formatNeo4jErrorMessage } from "../db/errors.js";
import { movieQueries } from "../db/queries.js";

/**
 * Converts a Neo4j record into a plain object for logging.
 *
 * @param record - Neo4j result record.
 * @returns Plain object representation.
 */
function toObject(record: Neo4jRecord): Record<string, unknown> {
  const output: Record<string, unknown> = {};

  for (const key of record.keys) {
    const safeKey = String(key);
    output[safeKey] = record.get(key);
  }

  return output;
}

type QueryEntry = Readonly<{
  readonly name: string;
  readonly label: string;
  readonly cypher: string;
}>;

const queryEntries = [
  {
    name: "actors-and-movies",
    label: "Actors and movies",
    cypher: movieQueries.listActorsAndMovies,
  },
  {
    name: "co-actors",
    label: "Co-actors",
    cypher: movieQueries.coActors,
  },
  {
    name: "drama-movies",
    label: "Drama movies",
    cypher: movieQueries.dramaMovies,
  },
  {
    name: "genre-movie-counts",
    label: "Movie counts by genre",
    cypher: movieQueries.genreMovieCounts,
  },
  {
    name: "movies-by-genre",
    label: "Movies by genre",
    cypher: movieQueries.moviesByGenre,
  },
  {
    name: "movies-by-actor",
    label: "Movies by actor",
    cypher: movieQueries.moviesByActor,
  },
] as const;

type QueryName = (typeof queryEntries)[number]["name"];

type CliOptions = {
  queryName?: string;
  list: boolean;
  help: boolean;
  parameters: Record<string, string>;
};

/**
 * Prints the available named movie queries.
 */
function printAvailableQueries(): void {
  console.log("Available movie queries:");

  for (const { name, label } of queryEntries) {
    console.log(`  ${name} - ${label}`);
  }

  console.log(
    "\nUsage: tsx src/scripts/runMovieQueries.ts [--query QUERY_NAME] [--list] [--help] [--param KEY=VALUE]...",
  );
}

/**
 * Parses command-line arguments for the movie query runner.
 *
 * @param args - Raw CLI arguments.
 * @returns Parsed invocation options.
 */
export function parseArgs(args: string[]): CliOptions {
  const result: CliOptions = { list: false, help: false, parameters: {} };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    switch (arg) {
      case "--help":
      case "-h":
        result.help = true;
        break;
      case "--list":
      case "-l":
        result.list = true;
        break;
      case "--query":
      case "-q": {
        index += 1;
        const value = args[index];

        if (!value) {
          throw new Error("The --query option requires a query name.");
        }

        result.queryName = value;
        break;
      }
      case "--param":
      case "-p": {
        index += 1;
        const value = args[index];

        if (!value || !value.includes("=")) {
          throw new Error("The --param option requires a KEY=VALUE argument.");
        }

        const [key, ...rest] = value.split("=");
        const paramValue = rest.join("=");

        if (!key) {
          throw new Error("The --param option requires a non-empty key.");
        }

        result.parameters[key] = paramValue;
        break;
      }
      default:
        throw new Error(`Unknown option: ${arg}`);
    }
  }

  return result;
}

/**
 * Determines whether a supplied string matches a known query name.
 *
 * @param value - Candidate query name.
 * @returns True when the value is a valid named query.
 */
function isQueryName(value: string): value is QueryName {
  return queryEntries.some((entry) => entry.name === value);
}

/**
 * Finds a movie query definition by its name.
 *
 * @param queryName - Name of the query to resolve.
 * @returns The query definition or undefined when not found.
 */
export function findQueryByName(queryName: string): QueryEntry | undefined {
  return queryEntries.find((entry) => entry.name === queryName);
}

/**
 * Runs a few starter queries for the movie graph.
 */
async function main(): Promise<void> {
  const driver = createDriver();
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printAvailableQueries();
    return;
  }

  if (options.list) {
    printAvailableQueries();
    return;
  }

  if (options.queryName && !isQueryName(options.queryName)) {
    console.error(`Unknown query: ${options.queryName}`);
    printAvailableQueries();
    process.exitCode = 1;
    return;
  }

  const selectedQueries = options.queryName
    ? [findQueryByName(options.queryName)!]
    : queryEntries;

  try {
    for (const query of selectedQueries) {
      if (!query) {
        continue;
      }

      const requiresParams = query.cypher.includes("$");

      if (requiresParams && Object.keys(options.parameters).length === 0) {
        console.error(
          `Query "${query.name}" requires parameters. Use --param KEY=VALUE to pass parameters.`,
        );
        process.exitCode = 1;
        return;
      }

      const result = await runQuery(driver, query.cypher, options.parameters);
      console.log(`\n=== ${query.label} ===`);
      console.table(result.records.map(toObject));
    }
  } finally {
    await driver.close();
  }
}

if (import.meta.main) {
  main().catch((error: unknown) => {
    console.error("Failed to run movie queries.");
    console.error(error instanceof Error ? formatNeo4jErrorMessage(error) : error);
    process.exitCode = 1;
  });
}
