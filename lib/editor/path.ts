type AnyRecord = Record<string, unknown>;

function isRecord(value: unknown): value is AnyRecord {
  return value != null && typeof value === "object";
}

export function getByPath<T = unknown>(obj: unknown, path: string): T | undefined {
  if (!path) return obj as T;
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (!isRecord(current)) return undefined;
    current = (current as AnyRecord)[part];
  }
  return current as T;
}

export function setByPath<TObj extends AnyRecord>(
  obj: TObj,
  path: string,
  value: unknown
): TObj {
  const parts = path.split(".").filter(Boolean);
  if (parts.length === 0) return obj;

  const root = structuredClone(obj) as AnyRecord;
  let current: AnyRecord = root;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]!;
    const next = current[key];
    if (!isRecord(next)) current[key] = {};
    current = current[key] as AnyRecord;
  }
  current[parts[parts.length - 1]!] = value;
  return root as TObj;
}
