import React from 'react';
import { HeroSection } from '../components/sections/HeroSection';
import { TrustSection } from '../components/sections/TrustSection';
import { FeaturesSection } from '../components/sections/FeaturesSection';
import { HowItWorksSection } from '../components/sections/HowItWorksSection';
import { ProductPreviewSection } from '../components/sections/ProductPreviewSection';
import { PricingSection } from '../components/sections/PricingSection';
import { AboutSection } from '../components/sections/AboutSection';
import { ContactSection } from '../components/sections/ContactSection';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <TrustSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ProductPreviewSection />
      <PricingSection />
      <AboutSection />
      <ContactSection />
    </div>
  );
};
