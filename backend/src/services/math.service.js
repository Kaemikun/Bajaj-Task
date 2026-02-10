function generateFibonacci(n) {
  if (n <= 0) return [];
  if (n === 1) return [0];
  const series = [0, 1];
  for (let i = 2; i < n; i++) {
    series.push(series[i - 1] + series[i - 2]);
  }
  return series;
}

function isPrime(num) {
  if (num < 2) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(num); i += 2) {
    if (num % i === 0) return false;
  }
  return true;
}

function filterPrimes(arr) {
  return arr.filter(isPrime);
}

function gcd(a, b) {
  while (b) [a, b] = [b, a % b];
  return Math.abs(a);
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

function computeHCF(arr) {
  return arr.reduce((acc, val) => gcd(acc, val));
}

function computeLCM(arr) {
  return arr.reduce((acc, val) => lcm(acc, val));
}

module.exports = {
  generateFibonacci,
  filterPrimes,
  computeHCF,
  computeLCM,
};
