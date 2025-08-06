

import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const Logo = () => (
    <div className="flex items-center gap-2">
       <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2L2 7V17L12 22L22 17V7L12 2ZM4 8.236L12 13L20 8.236V16L12 20L4 16V8.236Z" fill="currentColor"/>
    </svg>
      <span className="font-bold text-xl uppercase text-white">LUXE</span>
    </div>
);


export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
                <Logo />
                <p className="mt-4 max-w-xs text-gray-400">The premier destination for luxury visual content.</p>
            </div>
          <div>
            <h3 className="font-semibold mb-4 uppercase">Discover</h3>
            <ul className="space-y-2">
              <li><Link href="/models" className="text-gray-400 hover:text-white transition-colors">Models</Link></li>
              <li><Link href="/videos" className="text-gray-400 hover:text-white transition-colors">Videos</Link></li>
              <li><Link href="/galleries" className="text-gray-400 hover:text-white transition-colors">Galleries</Link></li>
            </ul>
          </div>
           <div>
            <h3 className="font-semibold mb-4 uppercase">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <Separator className="bg-gray-700" />
        <div className="flex flex-col md:flex-row items-center justify-center pt-8">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {currentYear} LUXE. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
