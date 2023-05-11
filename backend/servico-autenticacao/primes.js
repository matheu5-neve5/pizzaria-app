const main = (params) => {
  const isPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++) {
      if (num % i === 0) return false;
    }
    return true;
  };

  return Array.from({ length: 1000 - 1 }, (_, i) => i + 2)
    .filter(isPrime)
    .reduce((acc, curr) => acc + curr, 0);
};

console.log('A soma de todos os números primos entre 1 e 1000 é:', main());
