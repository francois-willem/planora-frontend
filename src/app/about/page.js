// app/about/page.js
"use client"
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Navbar showLogoText={true} />

      {/* About Content Section */}
      <section className="py-8 sm:py-12 bg-white/50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs sm:text-sm font-medium mb-4">
                <span className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                Our Story
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-blue-600 dark:from-slate-100 dark:via-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
                About Planora
              </h1>
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed">
                <p className="text-base sm:text-lg">
                  Planora began with a real problem: my partner worked at a swim school where scheduling was a daily challenge. Catch-up lessons, rescheduling, and staying in sync with busy families created unnecessary admin and constant frustration. Families struggled to keep track of lesson times, and the school struggled to stay organised — all because the right tools didn&apos;t exist.
                </p>

                <p className="text-base sm:text-lg">
                    What began as an idea to streamline scheduling for one swim school quickly grew into a vision to support many more. Today, Planora has evolved into a smart, flexible scheduling platform designed for small businesses and active families who need simple online booking, automated reminders, efficient catch-up and reschedule management, and a clear, centralised calendar that keeps everyone organised.
                </p>


                <ul className="list-none space-y-3 my-6 pl-0">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-base sm:text-lg">Easy online scheduling</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-base sm:text-lg">Automated reminders</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-base sm:text-lg">Catch-up and reschedule management</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-base sm:text-lg">Centralised calendars</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-base sm:text-lg">Clear communication between businesses and clients</span>
                  </li>
                </ul>

                <p className="text-base sm:text-lg">
                    Our mission is to make scheduling simple, fast, and reliable — whether you run a swim school, fitness classes, tutoring sessions, wellness services, or any business that relies on managing lessons, appointments, or recurring activities.
                </p>

                <p className="text-base sm:text-lg">
                    Planora is built on real experience, feedback from instructors and families, and a passion for helping businesses run smoothly. We focus on clean design, powerful automation, and tools that save time for both business owners and their clients.
                </p>

                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-slate-50 dark:from-blue-900/20 dark:to-slate-800/50 rounded-xl border border-blue-200 dark:border-blue-800">
                  <p className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 text-center">
                    Planora helps you spend less time organising and more time doing what matters.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

