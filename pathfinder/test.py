class Solution:
    def countPrimes(self, n: int) -> int: 
        if (n <= 2): return 0 
        isPrime = [1] * n 
        isPrime[0] = isPrime[1] = 0 
        i = 2 
        while (i * i < n): 
            if (isPrime[i] == 1): 
                isPrime[i*i:n:i] = [0] * (1 + (n - i * i - 1) // i) 
            i += 1 if i == 2 else 2 
        return sum(isPrime)
