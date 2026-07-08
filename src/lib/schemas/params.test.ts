import { describe, it, expect } from "vitest";
import { songIdSchema, uuidSchema } from "./params";

describe("songIdSchema", () => {
  it("accepts a plain numeric id", () => {
    expect(songIdSchema.safeParse("482").success).toBe(true);
  });

  it("rejects a path-traversal payload", () => {
    expect(songIdSchema.safeParse("../../etc/passwd").success).toBe(false);
  });

  it("rejects a value with trailing garbage", () => {
    expect(songIdSchema.safeParse("482;evil").success).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(songIdSchema.safeParse("").success).toBe(false);
  });
});

describe("uuidSchema", () => {
  it("accepts a well-formed uuid", () => {
    expect(uuidSchema.safeParse("550e8400-e29b-41d4-a716-446655440000").success).toBe(true);
  });

  it("rejects a path-traversal payload", () => {
    expect(uuidSchema.safeParse("../../admin").success).toBe(false);
  });

  it("rejects a malformed uuid", () => {
    expect(uuidSchema.safeParse("not-a-uuid").success).toBe(false);
  });
});
