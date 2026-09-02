import Link from 'next/link';
import { HiOutlineHome } from 'react-icons/hi';

export default function NotFound() {
  return (
  <div className="min-h-[70vh] flex items-center justify-center px-4">
  <div className="text-center">
  <p className="text-[120px] leading-none font-bold text-primary/20 select-none">404</p>
  <h1 className="text-3xl font-bold text-slateText  mt-4">Page Not Found</h1>
  <p className="text-muted mt-3 max-w-md mx-auto mb-8">
  The page you&apos;re looking for doesn&apos;t exist or has been moved.
  </p>
  <Link href="/" className="btn-primary inline-flex">
  <HiOutlineHome className="w-5 h-5" /> Go Back Home
  </Link>
  </div>
  </div>
  );
}