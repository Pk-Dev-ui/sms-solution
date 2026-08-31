export type RetryableOperation<T> = () => Promise<T>;

export async function withGraphRetry<T>(operation: RetryableOperation<T>, maxAttempts = 5): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await operation();
    } catch (error: any) {
      attempt++;
      const status = error?.statusCode || error?.status;
      const retryAfter = Number(error?.response?.headers?.get?.("Retry-After") || error?.headers?.["retry-after"] || 0);
      const retryable = status === 429 || status === 503 || status === 504;
      if (!retryable || attempt >= maxAttempts) throw error;
      const delayMs = retryAfter ? retryAfter * 1000 : Math.min(30000, Math.pow(2, attempt) * 1000 + Math.random() * 500);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}
