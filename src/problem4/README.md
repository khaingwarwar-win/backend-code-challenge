# Problem 4 – Three ways to sum 1..n

Three implementations of `sum_to_n(n)`, which returns `1 + 2 + ... + n`.

Edge cases: negative values and zero both return `0`. The challenge states that `n` is an integer, so the functions assume integer input.

### A – Iterative

Plain loop, O(n) time, O(1) space. Nothing clever, just a clear reference.

### B – Arithmetic formula

Gauss's closed-form `n(n+1)/2` — O(1) time and space. This is what you'd ship in practice.

### C – Divide-and-conquer recursion

Splits the range in half recursively. O(n) time, O(log n) stack depth. Avoids the stack overflow risk of a naive `sum(n) = n + sum(n-1)` at large n.

```bash
npm run test:problem4
```
