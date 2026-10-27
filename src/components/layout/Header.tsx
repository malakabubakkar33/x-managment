import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, UserCheck } from 'lucide-react';
import { Logo } from './Logo';
import { Button } from '../ui/Button';
import { Container } from './Container';
import { siteConfig } from '../../config/site';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith('/#')) {
      const hash = href.substring(2);
      if (location.pathname === '/') {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3.5'
          : 'bg-white/80 backdrop-blur-sm border-b border-slate-200/50 py-4 sm:py-5'
      }`}
    >
      <Container size="lg">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Logo />

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-semibold text-slate-600"
          >
            {siteConfig.navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (location.pathname === '/' && item.href.startsWith('/#')) {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }
                }}
                className="px-3 py-2 rounded-lg hover:text-brand-600 hover:bg-slate-100/70 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              to="/login"
              variant="ghost"
              size="sm"
              leftIcon={<UserCheck className="w-4 h-4 text-slate-500" />}
              className="text-slate-700 hover:text-brand-600 font-semibold"
            >
              Sign In
            </Button>
            <Button
              to="/get-started"
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <Button
              to="/login"
              variant="secondary"
              size="sm"
              className="px-3 py-1.5 text-xs font-semibold"
            >
              Sign In
            </Button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 transition-colors"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-slate-200/80 bg-white rounded-2xl p-5 shadow-elevated animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-1">
              {siteConfig.navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    if (location.pathname === '/' && item.href.startsWith('/#')) {
                      e.preventDefault();
                      handleNavClick(item.href);
                    } else {
                      setMobileMenuOpen(false);
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:text-brand-600 hover:bg-brand-50/60 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <Button
                to="/get-started"
                variant="primary"
                fullWidth
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};
