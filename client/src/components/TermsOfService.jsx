import React from 'react';

export default function TermsOfService() {
  return (
    <div className="justify-center fixed inset-0 mt-16 min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="space-y-6 text-gray-600">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Caption's services, you agree to be bound by these Terms of Service
              and all applicable laws and regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Service Description</h2>
            <p className="mb-4">
              Caption provides AI-powered transcription services for audio and video content.
              We reserve the right to modify or discontinue the service at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. User Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintain accurate account information</li>
              <li>Protect your account credentials</li>
              <li>Comply with all applicable laws</li>
              <li>Respect intellectual property rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Payment Terms</h2>
            <p className="mb-4">
              Users agree to pay all fees according to the pricing plan selected.
              Refunds are handled according to our refund policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Limitation of Liability</h2>
            <p>
              Caption is not liable for any indirect, incidental, or consequential damages
              arising from the use of our services.
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