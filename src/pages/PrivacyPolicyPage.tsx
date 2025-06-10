import React from 'react';
import { FaUserShield } from 'react-icons/fa';

const PrivacyPolicyPage: React.FC = () => (
  <div>
    <section className="py-8 md:py-16">
      <div className="container mx-auto text-center mt-16">
        <div className="flex flex-col items-center mb-8">
          <FaUserShield className="w-12 h-12 text-primary mb-4" />
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        </div>
        <p className="text-lg text-secondary max-w-3xl mx-auto">
          Learn how ThinkRED Technologies protects your privacy and handles your
          personal information with care and transparency.
        </p>
      </div>
    </section>
    <section className="bg-backgroundAlt">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="prose prose-lg">
          <h2>1. Information Collection</h2>
          <p>
            We collect information you provide directly to us, such as when you
            fill out a contact form or subscribe to our newsletter.
          </p>
          <h2>2. Use of Information</h2>
          <p>
            We use your information to respond to your inquiries, provide
            services, and improve our website.
          </p>
          <h2>3. Cookies</h2>
          <p>
            Our website may use cookies to enhance your experience. You can
            choose to disable cookies through your browser settings.
          </p>
          <h2>4. Data Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal
            information to outside parties except as required by law.
          </p>
          <h2>5. Data Security</h2>
          <p>
            We implement a variety of security measures to maintain the safety
            of your personal information.
          </p>
          <h2>6. Changes to This Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. Changes will be
            posted on this page with an updated effective date.
          </p>
          <h2>7. Contact Us</h2>
          <p>
            If you have any questions regarding this Privacy Policy, you may
            contact us at hello@thinkred.tech.
          </p>
        </div>
      </div>
    </section>
  </div>
);

export default PrivacyPolicyPage;
