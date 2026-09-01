export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <div className="container-custom py-12 max-w-3xl mx-auto">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">Home / Privacy</p>
      <h1 className="text-3xl font-bold text-slateText dark:text-white mb-6">Privacy Policy</h1>
      <div className="space-y-6 text-muted text-sm leading-relaxed">
        <p><em>Last updated: August 2026</em></p>
        <p>ElectroCart (“we”, “our”, or “us”) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>

        <h2 className="text-lg font-bold text-slateText dark:text-white mt-6">Information We Collect</h2>
        <p>We may collect information about you in a variety of ways, including personal data such as your name, email address, phone number, and shipping address, as well as usage data like browser type, pages visited, and time spent on our site.</p>

        <h2 className="text-lg font-bold text-slateText dark:text-white mt-6">How We Use Your Information</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>To process and fulfill your orders</li>
          <li>To communicate with you about your orders, products, and services</li>
          <li>To improve our website and services</li>
          <li>To send promotional communications (with your consent)</li>
          <li>To ensure the security of our platform</li>
        </ul>

        <h2 className="text-lg font-bold text-slateText dark:text-white mt-6">Cookies</h2>
        <p>We use cookies and similar technologies to remember your preferences, keep items in your cart, and understand how visitors use our site. You can disable cookies in your browser at any time, though some features may not work as intended.</p>

        <h2 className="text-lg font-bold text-slateText dark:text-white mt-6">Data Security</h2>
        <p>We implement reasonable security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>

        <h2 className="text-lg font-bold text-slateText dark:text-white mt-6">Third-Party Services</h2>
        <p>We may share limited information with trusted partners who help us process payments and deliver orders. These partners are contractually obligated to keep your data confidential.</p>

        <h2 className="text-lg font-bold text-slateText dark:text-white mt-6">Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at electrocart@gmail.com.</p>
      </div>
    </div>
  );
}