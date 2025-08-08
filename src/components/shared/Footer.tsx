
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const Logo = () => (
    <div className="flex items-center gap-2">
       <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2L2 7V17L12 22L22 17V7L12 2ZM4 8.236L12 13L20 8.236V16L12 20L4 16V8.236Z" fill="currentColor"/>
    </svg>
      <span className="font-bold text-xl uppercase text-foreground font-headline">LUXE</span>
    </div>
);


export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card text-card-foreground border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
                <Logo />
                <p className="mt-4 max-w-xs text-muted-foreground">The premier destination for luxury visual content.</p>
            </div>
          <div>
            <h3 className="font-semibold mb-4 uppercase tracking-wider">Discover</h3>
            <ul className="space-y-3">
              <li><Link href="/models" className="text-muted-foreground hover:text-foreground transition-colors">Models</Link></li>
              <li><Link href="/videos" className="text-muted-foreground hover:text-foreground transition-colors">Videos</Link></li>
              <li><Link href="/galleries" className="text-muted-foreground hover:text-foreground transition-colors">Galleries</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
            </ul>
          </div>
           <div>
            <h3 className="font-semibold mb-4 uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <Separator className="bg-border my-8" />
        <div className="flex flex-col md:flex-row items-center justify-center pt-8">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            &copy; {currentYear} LUXE. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
