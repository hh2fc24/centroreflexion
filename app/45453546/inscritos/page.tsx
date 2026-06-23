import { EventRegistrantsPage } from "@/components/EventRegistrantsPage";
import { readDesproteccionEventRegistrations } from "@/lib/server/eventRegistrations";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/server/adminAuth";
import { roleAtLeast } from "@/lib/server/roles";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DesproteccionEventRegistrants() {
  const cookieStore = await cookies();
  const session = verifyAdminToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value ?? "");
  if (!session || !roleAtLeast(session.role, "editor")) {
    redirect("/admin");
  }

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
    data = await readDesproteccionEventRegistrations();
  } catch {
    // Let the client fetch attempt recover after hydration.
  }

  return (
    <EventRegistrantsPage
      initialCount={data.count}
      initialRegistrations={data.registrations}
      apiPath="/api/evento-desproteccion/inscritos"
      title="Inscritos al conversatorio “Desprotección y sufrimiento de la infancia en Chile”"
      subtitle="Vista ejecutiva para seguimiento de inscripciones y difusión del conversatorio con Juan Carlos Rauld."
      eventInfoText="Martes 30 de junio · 20:30 hrs. (Chile) · Streaming en vivo"
    />
  );
}
