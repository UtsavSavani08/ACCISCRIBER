import { motion } from 'framer-motion';

const plans = [
  {
    name: 'Starter',
    price: 0,
    credits: 20,
    description: 'Perfect for trying out our service. No credit card required.',
    features: [
      '20 minutes transcription credits',
      'Basic support',
      'Access to all languages',
      'Standard AI accuracy',
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: 9,
    credits: 100,
    description: 'For regular users who need more transcription time.',
    features: [
      '100 minutes transcription credits',
      'Priority support',
      'Access to all languages',
      'High AI accuracy',
    ],
    cta: 'Buy Now',
    highlight: true,
  },
  {
    name: 'Business',
    price: 29,
    credits: 500,
    description: 'Best for teams and businesses with high volume needs.',
    features: [
      '500 minutes transcription credits',
      'Premium support',
      'Access to all languages',
      'Highest AI accuracy',
      'Team management tools',
    ],
    cta: 'Contact Sales',
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <div className="fixed min-h-screen w-screen inset-0 mt-8 bg-gray-50 pt-24 pb-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Simple, Transparent Pricing
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Purchase minute credits as you need them. No subscriptions, no hidden fees. Only pay for what you use.
        </p>
      </motion.div>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            viewport={{ once: true }}
            className={`rounded-2xl shadow-lg border bg-white p-8 flex flex-col items-center ${
              plan.highlight ? 'border-blue-600 shadow-blue-100 scale-105' : 'border-gray-200'
            }`}
          >
            <h2 className="text-2xl font-bold mb-2 text-gray-900">{plan.name}</h2>
            <p className="text-gray-500 mb-4">{plan.description}</p>
            <div className="flex items-end mb-4">
              <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
              <span className="text-gray-500 ml-2 mb-1 text-lg">{plan.price === 0 ? '' : '/ one-time'}</span>
            </div>
            <div className="mb-4">
              <span className="inline-block bg-blue-100 text-blue-700 font-semibold px-4 py-1 rounded-full text-md">
                {plan.credits} minute credits
              </span>
            </div>
            <ul className="text-gray-700 mb-6 space-y-2 text-left w-full">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-2 rounded-lg font-semibold transition ${
                plan.highlight
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-blue-700 hover:bg-blue-100'
              }`}
            >
              {plan.cta}
            </button>
          </motion.div>
        ))}
      </div>
      <div className="max-w-2xl mx-auto mt-12 text-center text-gray-500 text-sm">
        <p>
          Need more minutes or a custom plan? <a href="/contact" className="text-blue-600 hover:underline">Contact us</a> for enterprise pricing.
        </p>
      </div>
    </div>
  );
}