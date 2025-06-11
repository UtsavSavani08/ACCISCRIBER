import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { FaTwitter, FaLinkedin, FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function Contact() {
  const emailServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const emailTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const emailPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
      };
      console.log('Sending email with params:', templateParams);
      console.log('Using EmailJS service ID:', emailServiceId);
      console.log('Using EmailJS template ID:', emailTemplateId);
      console.log('Using EmailJS public key:', emailPublicKey);

      await emailjs.send(
        emailServiceId,
        emailTemplateId,
        templateParams,
        emailPublicKey
      );

      alert('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-gradient-to-t from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Contact Us</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">We're here to help with your transcription needs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 border border-gray-100">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:bg-indigo-400 disabled:cursor-not-allowed font-medium text-base shadow-sm hover:shadow-md"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 border border-gray-100">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">Get in Touch</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-lg">
                  <FaEnvelope className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <a href="mailto:hello@dobodo.com" className="text-base text-indigo-600 hover:text-indigo-700 transition-colors duration-200">
                    hello@dobedosoft.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-lg">
                  <FaPhone className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-base text-gray-900">+91 9726181166</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-lg">
                  <FaMapMarkerAlt className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="text-base text-gray-900">DOBODO soft, Mota varacha, Surat, India </p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h4 className="text-lg font-semibold text-gray-900 mb-6">Connect With Us</h4>
              <div className="flex space-x-6">
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-gray-100 p-3 rounded-lg hover:bg-indigo-100 transition-colors duration-200 group"
                >
                  <FaTwitter className="w-6 h-6 text-gray-600 group-hover:text-indigo-600" />
                </a>
                <a 
                  href="https://www.linkedin.com/company/dobedo-soft/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-gray-100 p-3 rounded-lg hover:bg-indigo-100 transition-colors duration-200 group"
                >
                  <FaLinkedin className="w-6 h-6 text-gray-600 group-hover:text-indigo-600" />
                </a>
                <a 
                  href="https://github.com/UtsavSavani08" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-gray-100 p-3 rounded-lg hover:bg-indigo-100 transition-colors duration-200 group"
                >
                  <FaGithub className="w-6 h-6 text-gray-600 group-hover:text-indigo-600" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
