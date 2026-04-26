/**
 * Neo4j error classification helpers.
 *
 * These utilities make Neo4j error handling easier to understand and
 * enable retry behavior for transient failures.
 */
import type { Neo4jError } from "neo4j-driver";

export type Neo4jErrorCategory =
  | "authentication"
  | "authorization"
  | "connection"
  | "constraint"
  | "syntax"
  | "validation"
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

function findNeo4jError(error: unknown): Neo4jError | null {
  let current: unknown = error;

  for (let depth = 0; depth < 5; depth += 1) {
    if (isNeo4jError(current)) {
      return current;
    }

    if (current instanceof Error && current.cause !== undefined) {
      current = current.cause;
      continue;
    }

    break;
  }

  return null;
}

export function getNeo4jErrorCode(error: unknown): string | null {
  const neo4jError = findNeo4jError(error);
  return neo4jError?.code ?? null;
}

export function classifyNeo4jError(error: unknown): Neo4jErrorCategory {
  const neo4jError = findNeo4jError(error);
  if (!neo4jError) {
    return "unknown";
  }

  const code = neo4jError.code;

  if (
    code.startsWith("Neo.ClientError.Security.Unauthorized") ||
    code.startsWith("Neo.ClientError.Security.Authentication")
  ) {
    return "authentication";
  }

  if (
    code.startsWith("Neo.ClientError.Security.Authorization") ||
    code === "Neo.ClientError.Statement.AuthorizationViolation"
  ) {
    return "authorization";
  }

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
    code.startsWith("Neo.ClientError.Statement.ArgumentError") ||
    code.startsWith("Neo.ClientError.Statement.TypeError") ||
    code.startsWith("Neo.ClientError.Statement.SemanticError")
  ) {
    return "validation";
  }

  if (code.includes("Timeout") || code.includes("TimedOut") || code.includes("OperationTimedOut")) {
    return "timeout";
  }

  if (
    code.startsWith("Neo.TransientError.Transaction") ||
    code.startsWith("Neo.TransientError.General") ||
    code.startsWith("Neo.TransientError.Network") ||
    code === "Neo.ClientError.Transaction.Terminated" ||
    code === "Neo.ClientError.RequestExpired"
  ) {
    return "transient";
  }

  return "unknown";
}

export function isRetryableNeo4jError(error: unknown): boolean {
  const category = classifyNeo4jError(error);

  return category === "connection" || category === "transient" || category === "timeout";
}

export function getNeo4jErrorHttpStatus(error: unknown): number {
  const category = classifyNeo4jError(error);

  if (category === "authentication") {
    return 401;
  }

  if (category === "authorization") {
    return 403;
  }

  if (category === "constraint") {
    return 409;
  }

  if (category === "syntax" || category === "validation") {
    return 400;
  }

  if (category === "connection" || category === "timeout" || category === "transient") {
    return 503;
  }

  return 500;
}

export function formatNeo4jErrorMessage(error: unknown): string {
  const neo4jError = findNeo4jError(error);
  if (!neo4jError) {
    return error instanceof Error ? error.message : String(error);
  }

  const category = classifyNeo4jError(neo4jError);
  return `Neo4j ${category} error [${neo4jError.code}]: ${neo4jError.message}`;
}
