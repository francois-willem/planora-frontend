// app/pricing/page.js
"use client"
import Link from "next/link";
import { BusinessRegisterButton } from "../../../components/BusinessAuthButtons";
import { TierProvider } from "../../../lib/TierContext";
import TierSelector from "../../../components/TierSelector";
import FeatureWrapper, { FeatureBadge } from "../../../components/FeatureWrapper";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { TIERS, TIER_FEATURES, FEATURE_DESCRIPTIONS } from "../../../lib/tierConstants";

export default function PricingPage() {
  return (
    <TierProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Navbar showLogoText={true} />

      {/* Pricing Hero Section */}
      <section className="flex-1 flex items-center py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8">
              <span className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mr-2 animate-pulse"></span>
              Simple, transparent pricing
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-blue-600 dark:from-slate-100 dark:via-blue-300 dark:to-blue-400 bg-clip-text text-transparent leading-tight">
              Choose Your
              <br />
              <span className="text-blue-600 dark:text-blue-400">Perfect Plan</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
              Start with our free trial and scale as you grow. No hidden fees, no surprises.
            </p>
            
            {/* Tier Selector for Demo */}
            <div className="max-w-md mx-auto mb-6 sm:mb-8 px-4 sm:px-0">
              <TierSelector />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="py-12 sm:py-24 bg-white/50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-blue-800 dark:from-slate-100 dark:to-blue-300 bg-clip-text text-transparent">
              Pricing Plans
            </h3>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto px-4 sm:px-0">
              Select the plan that fits your business needs. All plans include our core features.
            </p>
          </div>
          
          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 relative">
              <div className="text-center mb-6 sm:mb-8">
                <h4 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Basic</h4>
                <div className="mb-2">
                  <span className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400">R500</span>
                  <span className="text-slate-600 dark:text-slate-300">/month</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Up to 100 client accounts</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Additional 50 client accounts = +R200</p>
              </div>
              
              <div className="space-y-4 mb-8">
                {TIER_FEATURES[TIERS.BASIC].map((feature) => (
                  <div key={feature} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700 dark:text-slate-300">{FEATURE_DESCRIPTIONS[feature]}</span>
                    </div>
                    <FeatureBadge feature={feature} requiredTier={TIERS.BASIC} />
                  </div>
                ))}
              </div>
              
              <BusinessRegisterButton className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 sm:py-3 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Select Basic Plan
              </BusinessRegisterButton>
            </div>

            {/* Starter Plan */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 relative">
              <div className="text-center mb-8">
                <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Starter</h4>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">R1,000</span>
                  <span className="text-slate-600 dark:text-slate-300">/month</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Everything in Basic, plus:</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Up to 150 client accounts</p>
              </div>
              
              <div className="space-y-4 mb-8">
                {TIER_FEATURES[TIERS.STARTER].map((feature) => (
                  <div key={feature} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700 dark:text-slate-300">{FEATURE_DESCRIPTIONS[feature]}</span>
                    </div>
                    <FeatureBadge feature={feature} requiredTier={TIERS.STARTER} />
                  </div>
                ))}
              </div>
              
              <BusinessRegisterButton className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Select Starter Plan
              </BusinessRegisterButton>
            </div>

            {/* Growth Plan */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border-2 border-blue-200 dark:border-blue-600 hover:shadow-2xl transition-all duration-300 relative">
              {/* Popular Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              
              <div className="text-center mb-8">
                <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Growth</h4>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">R2,500</span>
                  <span className="text-slate-600 dark:text-slate-300">/month</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Everything in Starter, plus:</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Up to 200 client accounts</p>
              </div>
              
              <div className="space-y-4 mb-8">
                {TIER_FEATURES[TIERS.GROWTH].map((feature) => (
                  <div key={feature} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700 dark:text-slate-300">{FEATURE_DESCRIPTIONS[feature]}</span>
                    </div>
                    <FeatureBadge feature={feature} requiredTier={TIERS.GROWTH} />
                  </div>
                ))}
              </div>
              
              <BusinessRegisterButton className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Select Growth Plan
              </BusinessRegisterButton>
            </div>
          </div>

          {/* Coming Soon Section */}
          <div className="max-w-4xl mx-auto mt-16">
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
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </TierProvider>
  );
}
