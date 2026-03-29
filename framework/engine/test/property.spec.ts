import { describe, it, expect } from "vitest";
import { SimpleProperty, BoundProperty } from "../src/property";

describe("Property system", () => {
  it("SimpleProperty get/set and invalidation", () => {
    const p = new SimpleProperty(1);
    let invalidated = false;
    p.addListener({
      invalidate: () => {
        invalidated = true;
      },
    });
    p.set(2);
    expect(p.get()).toBe(2);
    expect(invalidated).toBe(true);
  });

  it("BoundProperty computes and invalidates", () => {
    const a = new SimpleProperty(1);
    const b = new SimpleProperty(10);
    const doubleA = new BoundProperty([a], () => a.get() * 2);
    const sum2ab = new BoundProperty(
      [doubleA, b],
      () => doubleA.get() + b.get(),
    );
    expect(doubleA.get()).toBe(2);
    expect(sum2ab.get()).toBe(12);

    a.set(2);
    expect(doubleA.isValid()).toBe(false);
    expect(doubleA.getCachedValue()).toBe(2);
    expect(sum2ab.isValid()).toBe(false);
    expect(sum2ab.getCachedValue()).toBe(12);

    expect(doubleA.get()).toBe(4);
    expect(doubleA.isValid()).toBe(true);
    expect(sum2ab.isValid()).toBe(false);

    expect(sum2ab.get()).toBe(14);
    expect(doubleA.isValid()).toBe(true);
    expect(sum2ab.isValid()).toBe(true);

    a.set(3);
    expect(sum2ab.get()).toBe(16);
    expect(doubleA.isValid()).toBe(true);

    b.set(20);
    expect(doubleA.isValid()).toBe(true);
    expect(doubleA.getCachedValue()).toBe(6);
    expect(sum2ab.isValid()).toBe(false);
    expect(sum2ab.getCachedValue()).toBe(16);
    expect(sum2ab.get()).toBe(26);
  });
});
