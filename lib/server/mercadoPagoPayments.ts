import { mkdir, readFile } from "fs/promises";
import os from "os";
import path from "path";
import { writeJsonAtomic } from "@/lib/server/atomicWrite";
import { withLock } from "@/lib/server/locks";

export type MercadoPagoPaymentEvent = {
  id: string;
  receivedAt: number;
  paymentId?: string;
  topic?: string;
  type?: string;
  action?: string;
  status?: string;
  statusDetail?: string;
  externalReference?: string;
  amount?: number;
  raw: unknown;
};

function uniquePaths(paths: string[]): string[] {
  return [...new Set(paths)];
}

function paymentFileCandidates(): string[] {
  const configuredDir = process.env.CRC_DATA_DIR?.trim();
  return uniquePaths([
    configuredDir ? path.join(configuredDir, "mercadopago-payments.json") : "",
    path.join(process.cwd(), "data", "mercadopago-payments.json"),
    path.join(os.tmpdir(), "centroreflexion-data", "mercadopago-payments.json"),
  ].filter(Boolean));
}

async function readPaymentFile(filePath: string): Promise<MercadoPagoPaymentEvent[]> {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as MercadoPagoPaymentEvent[]) : [];
  } catch {
    return [];
  }
}

export async function appendMercadoPagoPaymentEvent(event: MercadoPagoPaymentEvent) {
  const files = paymentFileCandidates();
  const errors: string[] = [];

  for (const filePath of files) {
    try {
      await mkdir(path.dirname(filePath), { recursive: true });
      await withLock(`mercadopago:write:${filePath}`, async () => {
        const events = await readPaymentFile(filePath);
        events.unshift(event);
        await writeJsonAtomic(filePath, events.slice(0, 2000));
      });
      return { filePath };
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      errors.push(`${filePath}: ${detail}`);
    }
  }

  throw new Error(errors.join(" | "));
}
