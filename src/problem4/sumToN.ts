export function sum_to_n_a(n: number): number {
  // Iterative: O(n) time, O(1) space
  if (n <= 0) return 0;
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

export function sum_to_n_b(n: number): number {
  // Gauss formula n(n+1)/2: O(1) time, O(1) space — what you'd use in practice
  if (n <= 0) return 0;
  return (n * (n + 1)) / 2;
}

function sumRange(start: number, end: number): number {
  if (start > end) return 0;
  if (start === end) return start;

  const mid = Math.floor((start + end) / 2);
  return sumRange(start, mid) + sumRange(mid + 1, end);
}

export function sum_to_n_c(n: number): number {
  // Divide and conquer recursion: O(n) time, O(log n) stack depth
  if (n <= 0) return 0;
  return sumRange(1, n);
}
