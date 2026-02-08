// app/page.js
import { TierProvider } from "../../lib/TierContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import HomeContent from "./HomeContent";

export default function HomePage() {
  return (
    <TierProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <Navbar showLogoText={true} />
        <HomeContent />
        <Footer />
      </div>
    </TierProvider>
  );
}
