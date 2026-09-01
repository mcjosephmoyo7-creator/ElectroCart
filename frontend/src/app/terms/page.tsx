export const metadata = { title: 'Terms & Conditions' };

export default function TermsPage() {
  return (
    <div className="container-custom py-12 max-w-3xl mx-auto">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">Home / Terms</p>
      <h1 className="text-3xl font-bold text-slateText dark:text-white mb-6">Terms & Conditions</h1>
      <div className="space-y-6 text-muted text-sm leading-relaxed">
        <p><em>Last updated: August 2026</em></p>
        <p>These Terms and Conditions (“Terms”) govern your use of the ElectroCart website and services. By accessing or using our services, you agree to be bound by these Terms.</p>

        <h2 className="text-lg font-bold text-slateText dark:text-white mt-6">Account Registration</h2>
        <p>To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>

        <h2 className="text-lg font-bold text-slateText dark:text-white mt-6">Products & Pricing</h2>
        <p>All product descriptions, images, and specifications are as accurate as possible. We reserve the right to modify prices without notice. In the event of a pricing error, we may cancel orders at our discretion.</p>

        <h2 className="text-lg font-bold text-slateText dark:text-white mt-6">Orders & Payments</h2>
        <p>Placing an order constitutes an offer to purchase. We reserve the right to accept or decline any order. Payment must be received in full before order processing.</p>

        <h2 className="text-lg font-bold text-slateText dark:text-white mt-6">Shipping & Delivery</h2>
        <p>Estimated delivery times are provided for convenience and are not guaranteed. Free shipping applies automatically to orders over $100. We are not responsible for delays caused by shipping carriers or customs processes.</p>

        <h2 className="text-lg font-bold text-slateText dark:text-white mt-6">Returns & Refunds</h2>
        <p>Unused items in their original packaging can be returned within 30 days of delivery for a full refund. Please contact our support team to initiate a return.</p>

        <h2 className="text-lg font-bold text-slateText dark:text-white mt-6">Contact Us</h2>
        <p>For questions about these Terms, reach out to us at electrocart@gmail.com.</p>
      </div>
    </div>
  );
}