import { describe, expect, it } from "vitest";
import {
  classifyNeo4jError,
  formatNeo4jErrorMessage,
  getNeo4jErrorCode,
  getNeo4jErrorHttpStatus,
  isRetryableNeo4jError,
} from "../src/db/errors.js";

describe("Neo4j error classification", () => {
  it("classifies syntax errors correctly", () => {
    const error = { code: "Neo.ClientError.Statement.SyntaxError", message: "Invalid use of reserved word." };

    expect(classifyNeo4jError(error)).toBe("syntax");
    expect(isRetryableNeo4jError(error)).toBe(false);
    expect(getNeo4jErrorHttpStatus(error)).toBe(400);
    expect(formatNeo4jErrorMessage(error)).toContain("Neo4j syntax error");
  });

  it("classifies constraint errors correctly", () => {
    const error = { code: "Neo.ClientError.Schema.ConstraintValidationFailed", message: "Unique constraint violated." };

    expect(classifyNeo4jError(error)).toBe("constraint");
    expect(isRetryableNeo4jError(error)).toBe(false);
    expect(getNeo4jErrorHttpStatus(error)).toBe(409);
    expect(formatNeo4jErrorMessage(error)).toContain("Neo4j constraint error");
  });

  it("classifies connection errors correctly", () => {
    const error = { code: "Neo.ClientError.Connection.ClientConnectorException", message: "Unable to connect." };

    expect(classifyNeo4jError(error)).toBe("connection");
    expect(isRetryableNeo4jError(error)).toBe(true);
    expect(getNeo4jErrorHttpStatus(error)).toBe(503);
    expect(formatNeo4jErrorMessage(error)).toContain("Neo4j connection error");
  });

  it("classifies transient errors correctly", () => {
    const error = { code: "Neo.TransientError.Transaction.Terminated", message: "Transaction terminated." };

    expect(classifyNeo4jError(error)).toBe("transient");
    expect(isRetryableNeo4jError(error)).toBe(true);
    expect(getNeo4jErrorHttpStatus(error)).toBe(503);
    expect(formatNeo4jErrorMessage(error)).toContain("Neo4j transient error");
  });

  it("classifies authentication and authorization errors", () => {
    const authnError = { code: "Neo.ClientError.Security.Unauthorized", message: "Wrong credentials." };
    const authzError = { code: "Neo.ClientError.Statement.AuthorizationViolation", message: "Access denied." };

    expect(classifyNeo4jError(authnError)).toBe("authentication");
    expect(getNeo4jErrorHttpStatus(authnError)).toBe(401);
    expect(classifyNeo4jError(authzError)).toBe("authorization");
    expect(getNeo4jErrorHttpStatus(authzError)).toBe(403);
  });

  it("unwraps Neo4j errors through Error.cause", () => {
    const wrapped = new Error("Query failed.", {
      cause: { code: "Neo.ClientError.Statement.SemanticError", message: "Invalid expression." },
    });

    expect(classifyNeo4jError(wrapped)).toBe("validation");
    expect(getNeo4jErrorCode(wrapped)).toBe("Neo.ClientError.Statement.SemanticError");
    expect(getNeo4jErrorHttpStatus(wrapped)).toBe(400);
    expect(formatNeo4jErrorMessage(wrapped)).toContain("Neo4j validation error");
  });

  it("returns a fallback message for unknown errors", () => {
    const error = { foo: "bar" };

    expect(classifyNeo4jError(error)).toBe("unknown");
    expect(getNeo4jErrorCode(error)).toBeNull();
    expect(isRetryableNeo4jError(error)).toBe(false);
    expect(getNeo4jErrorHttpStatus(error)).toBe(500);
    expect(formatNeo4jErrorMessage(error)).toBe("[object Object]");
  });
});
