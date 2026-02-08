// app/about/page.js
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import AboutContent from "./AboutContent";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Navbar showLogoText={true} />
      <AboutContent />
      <Footer />
    </div>
  );
}
