import { describe, it, expect } from "vitest";
import { formatCompactNumber } from "./format";

describe("formatCompactNumber", () => {
  it("renders sub-1000 values as localized integers", () => {
    expect(formatCompactNumber(0)).toBe("0");
    expect(formatCompactNumber(999)).toBe("999");
  });

  it("drops the decimal for round thousands", () => {
    expect(formatCompactNumber(1000)).toBe("1k");
  });

  it("shows one decimal for non-round values", () => {
    expect(formatCompactNumber(1100)).toBe("1.1k");
    expect(formatCompactNumber(1150)).toBe("1.2k");
  });

  it("selects the tier from the raw value before rounding", () => {
    expect(formatCompactNumber(999999)).toBe("1000k");
  });

  it("renders millions and billions", () => {
    expect(formatCompactNumber(1000000)).toBe("1M");
    expect(formatCompactNumber(1500000)).toBe("1.5M");
    expect(formatCompactNumber(1000000000)).toBe("1B");
  });
});
