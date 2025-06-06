import React from 'react';

export default function CookiePolicy() {
  return (
    <div className="justify-center fixed inset-0 mt-16 min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
        
        <div className="space-y-6 text-gray-600">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">What Are Cookies</h2>
            <p className="mb-4">
              Cookies are small text files that are placed on your device when you visit our website.
              They help us provide you with a better experience by remembering your preferences
              and understanding how you use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Types of Cookies We Use</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700">Essential Cookies</h3>
                <p>Required for the website to function properly</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Functional Cookies</h3>
                <p>Remember your preferences and settings</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Analytics Cookies</h3>
                <p>Help us understand how you use our service</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Managing Cookies</h2>
            <p className="mb-4">
              You can control and manage cookies in your browser settings. Please note that
              removing or blocking cookies may impact your user experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. We will notify you of any
              changes by posting the new policy on this page.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}