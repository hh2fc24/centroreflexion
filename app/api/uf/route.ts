import { NextResponse } from "next/server";
import { getCriticalConsultationUfQuote } from "@/lib/server/uf";

export async function GET() {
  const quote = await getCriticalConsultationUfQuote();
  return NextResponse.json({ ok: true, ...quote });
}
