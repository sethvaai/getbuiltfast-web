import Nav from "../components/Nav";
import BriefWizard from "../components/BriefWizard";

export const metadata = {
  title: "Start Your Project — GetBuiltFast",
  description: "Tell us what you want to build. Get an instant price estimate.",
};

export default function StartPage() {
  return (
    <main style={{ minHeight: "100vh" }}>
      <Nav />
      <div className="pt-20">
        <BriefWizard />
      </div>
    </main>
  );
}
