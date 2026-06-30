import { ContactCreationForm } from "./contact-creation-form";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "#f4f7f5",
      }}
    >
      <ContactCreationForm />
    </main>
  );
}
