export interface KV {
  get(
    key: string,
    options?: { type?: 'text' | 'json'; cacheTtl?: number },
  ): Promise<string | null>;
  put(
    key: string,
    value: string,
    options?: { expirationTtl?: number; metadata?: unknown },
  ): Promise<void>;
  delete(key: string): Promise<void>;
}
