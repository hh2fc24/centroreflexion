type Unlock = () => void;

type LockState = {
  locked: boolean;
  queue: Unlock[];
};

const locks = new Map<string, LockState>();

async function acquire(key: string) {
  const current = locks.get(key) ?? { locked: false, queue: [] };
  locks.set(key, current);
  if (!current.locked) {
    current.locked = true;
    return () => release(key);
  }
  return await new Promise<Unlock>((resolve) => {
    current.queue.push(() => {
      current.locked = true;
      resolve(() => release(key));
    });
  });
}

function release(key: string) {
  const current = locks.get(key);
  if (!current) return;
  const next = current.queue.shift();
  if (next) {
    next();
    return;
  }
  current.locked = false;
}

export async function withLock<T>(key: string, fn: () => Promise<T>) {
  const unlock = await acquire(key);
  try {
    return await fn();
  } finally {
    unlock();
  }
}

