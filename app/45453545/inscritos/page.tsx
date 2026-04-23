import { EventRegistrantsPage } from "@/components/EventRegistrantsPage";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function EventRegistrants() {
  let data: {
    count: number;
    registrations: Array<{
      id: string;
      name: string;
      email: string;
      phone: string;
      createdAt: number;
      source: string;
    }>;
  } = {
    count: 0,
    registrations: [],
  };

  try {
    const response = await fetch(`${getSiteUrl()}/api/evento/inscritos?ssr=1`, { cache: "no-store" });
    const json = (await response.json()) as {
      ok?: boolean;
      count?: number;
      registrations?: Array<{
        id: string;
        name: string;
        email: string;
        phone: string;
        createdAt: number;
        source: string;
      }>;
    };

    if (response.ok && json.ok) {
      data = {
        count: typeof json.count === "number" ? json.count : 0,
        registrations: Array.isArray(json.registrations) ? json.registrations : [],
      };
    }
  } catch {
    // Let the client fetch attempt recover after hydration.
  }

  return (
    <EventRegistrantsPage
      initialCount={data.count}
      initialRegistrations={data.registrations}
    />
  );
}
