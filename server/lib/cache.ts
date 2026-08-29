import NodeCache from "node-cache";

/**
 * Thin wrapper over node-cache providing a typed, promise-friendly TTL cache.
 *
 * Used to stay within third-party rate limits (notably Serpstack) and to speed
 * up repeated lookups. Each service owns its own namespace/instance.
 */
export class TtlCache {
  private readonly store: NodeCache;

  constructor(defaultTtlSeconds: number) {
    this.store = new NodeCache({
      stdTTL: defaultTtlSeconds,
      checkperiod: Math.max(60, Math.floor(defaultTtlSeconds / 2)),
      useClones: false,
    });
  }

  get<T>(key: string): T | undefined {
    return this.store.get<T>(key);
  }

  set<T>(key: string, value: T, ttlSeconds?: number): void {
    if (ttlSeconds === undefined) {
      this.store.set(key, value);
    } else {
      this.store.set(key, value, ttlSeconds);
    }
  }

  /**
   * Returns the cached value for `key`, or computes it via `producer`, caches
   * the result, and returns it. Failures are not cached.
   */
  async remember<T>(key: string, ttlSeconds: number, producer: () => Promise<T>): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== undefined) return cached;

    const value = await producer();
    this.set(key, value, ttlSeconds);
    return value;
  }

  flush(): void {
    this.store.flushAll();
  }
}
