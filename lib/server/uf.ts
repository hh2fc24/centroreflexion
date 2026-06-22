const DEFAULT_FALLBACK_UF_CLP = 40000;
export const CRITICAL_CONSULTATION_UF_QUANTITY = 2;

type MindicadorUfResponse = {
  serie?: Array<{ valor?: number }>;
};

type MindicadorGeneralResponse = {
  uf?: { valor?: number };
};

function toPositiveNumber(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

async function fetchUfFromDailyEndpoint() {
  const response = await fetch("https://mindicador.cl/api/uf", {
    next: { revalidate: 60 * 60 },
  });
  if (!response.ok) return null;

  const data = (await response.json()) as MindicadorUfResponse;
  return toPositiveNumber(data.serie?.[0]?.valor);
}

async function fetchUfFromGeneralEndpoint() {
  const response = await fetch("https://mindicador.cl/api", {
    next: { revalidate: 60 * 60 },
  });
  if (!response.ok) return null;

  const data = (await response.json()) as MindicadorGeneralResponse;
  return toPositiveNumber(data.uf?.valor);
}

export async function getCriticalConsultationUfQuote() {
  const fallbackUf =
    toPositiveNumber(process.env.CRC_FALLBACK_UF_CLP) ?? DEFAULT_FALLBACK_UF_CLP;

  const sources = [
    { name: "mindicador-uf", getValue: fetchUfFromDailyEndpoint },
    { name: "mindicador-general", getValue: fetchUfFromGeneralEndpoint },
  ];

  for (const source of sources) {
    try {
      const value = await source.getValue();
      if (value) {
        return {
          value,
          amount: Math.round(value * CRITICAL_CONSULTATION_UF_QUANTITY),
          quantity: CRITICAL_CONSULTATION_UF_QUANTITY,
          source: source.name,
          fallback: false,
        };
      }
    } catch {
      // Try the next source before using the local fallback.
    }
  }

  return {
    value: fallbackUf,
    amount: Math.round(fallbackUf * CRITICAL_CONSULTATION_UF_QUANTITY),
    quantity: CRITICAL_CONSULTATION_UF_QUANTITY,
    source: "local-fallback",
    fallback: true,
  };
}
