/**
 * Same-process dedupe for the contact route.
 *
 * A repeated submission with the same email, subject, and message shares one
 * in-flight attempt, and a successful attempt is remembered until the window
 * ends. This does not coordinate separate server instances. Failed deliveries
 * are not remembered, so a retry can try the email again.
 */

export interface IdempotencyCache<T> {
  run(key: string, work: () => Promise<T>, succeeded: (value: T) => boolean): Promise<T>;
}

export function createIdempotencyCache<T>(windowMs: number, now: () => number = Date.now): IdempotencyCache<T> {
  const entries = new Map<string, { expires: number; promise: Promise<T> }>();

  return {
    run(key, work, succeeded) {
      const current = entries.get(key);
      if (current && current.expires > now()) return current.promise;

      const promise = work()
        .then((value) => {
          if (succeeded(value)) {
            const existing = entries.get(key);
            if (existing) existing.expires = now() + windowMs;
          } else {
            entries.delete(key);
          }
          return value;
        })
        .catch((error: unknown) => {
          entries.delete(key);
          throw error;
        });

      entries.set(key, { expires: Number.POSITIVE_INFINITY, promise });
      return promise;
    },
  };
}

export function contactIdempotencyKey(value: { email: string; subject: string; message: string }): string {
  return `${value.email}\n${value.subject}\n${value.message}`;
}

export type DeliveryResult =
  | { readonly success: true }
  | { readonly success: false; readonly error: string; readonly status: number };

export const contactIdempotency = createIdempotencyCache<DeliveryResult>(10 * 60 * 1000);
