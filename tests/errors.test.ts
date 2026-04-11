import { describe, expect, it } from "vitest";
import { classifyNeo4jError, formatNeo4jErrorMessage, isRetryableNeo4jError } from "../src/db/errors.js";

describe("Neo4j error classification", () => {
  it("classifies syntax errors correctly", () => {
    const error = { code: "Neo.ClientError.Statement.SyntaxError", message: "Invalid use of reserved word." };

    expect(classifyNeo4jError(error)).toBe("syntax");
    expect(isRetryableNeo4jError(error)).toBe(false);
    expect(formatNeo4jErrorMessage(error)).toContain("Neo4j syntax error");
  });

  it("classifies constraint errors correctly", () => {
    const error = { code: "Neo.ClientError.Schema.ConstraintValidationFailed", message: "Unique constraint violated." };

    expect(classifyNeo4jError(error)).toBe("constraint");
    expect(isRetryableNeo4jError(error)).toBe(false);
    expect(formatNeo4jErrorMessage(error)).toContain("Neo4j constraint error");
  });

  it("classifies connection errors correctly", () => {
    const error = { code: "Neo.ClientError.Connection.ClientConnectorException", message: "Unable to connect." };

    expect(classifyNeo4jError(error)).toBe("connection");
    expect(isRetryableNeo4jError(error)).toBe(true);
    expect(formatNeo4jErrorMessage(error)).toContain("Neo4j connection error");
  });

  it("classifies transient errors correctly", () => {
    const error = { code: "Neo.TransientError.Transaction.Terminated", message: "Transaction terminated." };

    expect(classifyNeo4jError(error)).toBe("transient");
    expect(isRetryableNeo4jError(error)).toBe(true);
    expect(formatNeo4jErrorMessage(error)).toContain("Neo4j transient error");
  });

  it("returns a fallback message for unknown errors", () => {
    const error = { foo: "bar" };

    expect(classifyNeo4jError(error)).toBe("unknown");
    expect(isRetryableNeo4jError(error)).toBe(false);
    expect(formatNeo4jErrorMessage(error)).toBe("[object Object]");
  });
});
