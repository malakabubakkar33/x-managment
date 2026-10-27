import React from 'react';
import { Container } from '../layout/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { FeatureCard } from '../ui/FeatureCard';
import { featuresList } from '../../config/features';

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 lg:py-28 bg-slate-50 scroll-mt-12">
      <Container size="lg">
        <SectionHeading
          badge="Platform Architecture"
          title="Engineered Specifically for Pharmacy Workflows"
          subtitle="Explore the 12 core operational modules planned for the X Management ERP suite — built to streamline dispensing, inventory accountability, and retail accounting."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuresList.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </Container>
    </section>
  );
};
