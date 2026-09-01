import type { Metadata } from 'next';
import { Inter, Poppins, Roboto } from 'next/font/google';
import './globals.css';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import VisitTracker from '@/components/VisitTracker';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ElectroCart - Next-Gen Gadgets & Appliances',
    template: '%s | ElectroCart',
  },
  description:
    'Upgrade your home with the latest tech at unbeatable prices. Shop electronics, kitchen appliances, televisions, refrigerators, washing machines, tablets and gadget accessories from ElectroCart.',
  keywords: ['ElectroCart', 'e-commerce', 'online store', 'electronics', 'appliances', 'gadgets'],
  authors: [{ name: 'ElectroCart' }],
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'ElectroCart - Next-Gen Gadgets & Appliances',
    description: 'Upgrade your home with the latest tech at unbeatable prices.',
    type: 'website',
    siteName: 'ElectroCart',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} ${roboto.variable} font-sans`}>
        <LayoutWrapper>{children}</LayoutWrapper>
        <VisitTracker />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2600,
            style: { borderRadius: '12px', padding: '12px 16px', fontWeight: 500 },
          }}
        />
      </body>
    </html>
  );
}