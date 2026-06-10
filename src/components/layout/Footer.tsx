import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#0b1329] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* brand */}
          <div className="text-center md:text-left">
            <h3 className="text-white text-sm font-extrabold tracking-widest uppercase mb-1">
              TJERMIN
            </h3>
            <p className="text-gray-500 text-[10px] sm:text-xs font-semibold">
              &copy; 2026 BasicWear. All rights reserved.
            </p>
          </div>

          {/* nav */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/" className="text-gray-400 hover:text-white text-xs font-semibold transition-colors">
              Home
            </Link>
            <Link href="/#catalog" className="text-gray-400 hover:text-white text-xs font-semibold transition-colors">
              Inventory
            </Link>
            <Link href="/" className="text-gray-400 hover:text-white text-xs font-semibold transition-colors">
              About
            </Link>
            <Link href="/" className="text-gray-400 hover:text-white text-xs font-semibold transition-colors">
              Blog
            </Link>
            <Link href="/" className="text-gray-400 hover:text-white text-xs font-semibold transition-colors">
              Contact
            </Link>
          </div>

          {/* socials */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition-all"
              aria-label="Facebook"
            >
              <FaFacebookF className="text-xs" />
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition-all"
              aria-label="Twitter"
            >
              <FaTwitter className="text-xs" />
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition-all"
              aria-label="YouTube"
            >
              <FaYoutube className="text-xs" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
