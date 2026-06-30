import { ContactCreationForm } from "./contact-creation-form";
import { PageShell } from "../components/ui/page-shell";

export default function HomePage() {
  return (
    <PageShell>
      <ContactCreationForm />
    </PageShell>
  );
}
