/**
 * Neo4j error classification helpers.
 *
 * These utilities make Neo4j error handling easier to understand and
 * enable retry behavior for transient failures.
 */
import type { Neo4jError } from "neo4j-driver";

export type Neo4jErrorCategory =
  | "connection"
  | "constraint"
  | "syntax"
  | "timeout"
  | "transient"
  | "unknown";

export function isNeo4jError(error: unknown): error is Neo4jError {
  return (
    typeof error === "object" &&
    error !== null &&
    typeof (error as Neo4jError).code === "string"
  );
}

export function classifyNeo4jError(error: unknown): Neo4jErrorCategory {
  if (!isNeo4jError(error)) {
    return "unknown";
  }

  const code = error.code;

  if (code.startsWith("Neo.ClientError.Connection") || code.startsWith("Neo.ClientError.ServiceUnavailable")) {
    return "connection";
  }

  if (
    code === "Neo.ClientError.Schema.ConstraintValidationFailed" ||
    code === "Neo.ClientError.Schema.ConstraintVerificationFailed" ||
    code.startsWith("Neo.ClientError.Schema.Constraint")
  ) {
    return "constraint";
  }

  if (code.startsWith("Neo.ClientError.Statement.SyntaxError")) {
    return "syntax";
  }

  if (
    code.startsWith("Neo.TransientError.Transaction") ||
    code.startsWith("Neo.TransientError.General") ||
    code === "Neo.ClientError.Transaction.Terminated" ||
    code === "Neo.ClientError.RequestExpired"
  ) {
    return "transient";
  }

  if (code.includes("Timeout") || code.includes("TimedOut") || code.includes("OperationTimedOut")) {
    return "timeout";
  }

  return "unknown";
}

export function isRetryableNeo4jError(error: unknown): boolean {
  if (!isNeo4jError(error)) {
    return false;
  }

  return (
    error.code.startsWith("Neo.TransientError.") ||
    error.code.startsWith("Neo.ClientError.Connection") ||
    error.code === "Neo.ClientError.RequestExpired" ||
    error.code === "Neo.ClientError.Transaction.Terminated"
  );
}

export function formatNeo4jErrorMessage(error: unknown): string {
  if (!isNeo4jError(error)) {
    return error instanceof Error ? error.message : String(error);
  }

  const category = classifyNeo4jError(error);
  return `Neo4j ${category} error [${error.code}]: ${error.message}`;
}
