import { EventRegistrantsPage } from "@/components/EventRegistrantsPage";
import { readPublicEventRegistrations } from "@/lib/server/eventRegistrations";

export const dynamic = "force-dynamic";

export default async function EventRegistrants() {
  const data = await readPublicEventRegistrations();

  return (
    <EventRegistrantsPage
      initialCount={data.count}
      initialRegistrations={data.registrations}
    />
  );
}
