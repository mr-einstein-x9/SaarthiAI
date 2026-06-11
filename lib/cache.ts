// ── In-Memory LRU Cache ────────────────────────────────────────────────────

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class LRUCache<T> {
  private cache: Map<string, CacheEntry<T>>;
  private readonly maxSize: number;
  private readonly ttlMs: number;

  constructor(maxSize: number = 500, ttlSeconds: number = 600) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttlMs = ttlSeconds * 1000;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.cache.delete(key);
      return null;
    }

    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.data;
  }

  set(key: string, data: T): void {
    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }

    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}

// ── Singleton cache for API responses ──────────────────────────────────────

export const queryCache = new LRUCache<Record<string, unknown>>(500, 600);
