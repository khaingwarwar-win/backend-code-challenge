import { describe, expect, it } from "vitest";
import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from "./sumToN.js";

const implementations = [sum_to_n_a, sum_to_n_b, sum_to_n_c];

describe.each(implementations)("%s", (sum_to_n) => {
  it.each([
    [0, 0],
    [1, 1],
    [5, 15],
    [10, 55],
    [-3, 0],
  ])("sum_to_n(%i) === %i", (input, expected) => {
    expect(sum_to_n(input)).toBe(expected);
  });
});
