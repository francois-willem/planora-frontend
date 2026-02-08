"use client";

import TierSelector from "../../../components/TierSelector";
import PricingTiers from "../../../components/pricing/PricingTiers";
import Reveal from "../../../components/motion/Reveal";

export default function PricingContent() {
  return (
    <>
      {/* Pricing Hero Section */}
      <section className="flex-1 flex items-center py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <Reveal delay={0}>
              <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8">
                <span className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                Simple, transparent pricing
              </div>
            </Reveal>
            
            <Reveal delay={0.08}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-blue-600 dark:from-slate-100 dark:via-blue-300 dark:to-blue-400 bg-clip-text text-transparent leading-tight">
                Choose Your
                <br />
                <span className="text-blue-600 dark:text-blue-400">Perfect Plan</span>
              </h2>
            </Reveal>
            
            <Reveal delay={0.16}>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
                Start with our free trial and scale as you grow. No hidden fees, no surprises.
              </p>
            </Reveal>
            
            {/* Tier Selector for Demo */}
            <Reveal delay={0.24}>
              <div className="max-w-md mx-auto mb-6 sm:mb-8 px-4 sm:px-0">
                <TierSelector />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="py-12 sm:py-24 bg-white/50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <Reveal delay={0}>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-blue-800 dark:from-slate-100 dark:to-blue-300 bg-clip-text text-transparent">
                Pricing Plans
              </h3>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto px-4 sm:px-0">
                Select the plan that fits your business needs. All plans include our core features.
              </p>
            </Reveal>
          </div>
          
          {/* Animated Pricing Cards */}
          <PricingTiers />

          {/* Coming Soon Section */}
          <Reveal delay={0.2} className="max-w-4xl mx-auto mt-16">
            <div className="bg-gradient-to-r from-slate-100 to-blue-50 dark:from-slate-800 dark:to-slate-700 p-8 rounded-2xl border border-slate-200 dark:border-slate-600">
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
                  <span className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                  Coming Soon
                </div>
                <h4 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
                  Unlimited Plan
                </h4>
                <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
                  Unlimited plan with unlimited clients/staff, white-label app, API integrations, advanced automation, and dedicated support.
                </p>
                <div className="inline-flex items-center px-6 py-3 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-full font-medium">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Notify me when available
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
