import { mkdir, rename, rm, writeFile } from "fs/promises";
import path from "path";

export async function writeFileAtomic(filePath: string, data: string | Buffer, encoding?: BufferEncoding) {
  const dir = path.dirname(filePath);
  await mkdir(dir, { recursive: true });
  const tmp = path.join(dir, `.${path.basename(filePath)}.${process.pid}.${Date.now()}.tmp`);
  if (typeof data === "string") {
    await writeFile(tmp, data, { encoding: encoding ?? "utf8" });
  } else {
    await writeFile(tmp, data);
  }
  try {
    await rename(tmp, filePath);
  } catch {
    // On some platforms rename may fail if destination exists.
    try {
      await rm(filePath, { force: true });
    } catch {
      // ignore
    }
    await rename(tmp, filePath);
  }
}

export async function writeJsonAtomic(filePath: string, json: unknown) {
  await writeFileAtomic(filePath, JSON.stringify(json, null, 2) + "\n", "utf8");
}
