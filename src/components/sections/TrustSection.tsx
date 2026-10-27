import React from 'react';
import { ClipboardCheck, Boxes, Zap, BarChart3 } from 'lucide-react';
import { Container } from '../layout/Container';
import { siteConfig } from '../../config/site';

const icons: Record<string, React.FC<{ className?: string }>> = {
  ClipboardCheck,
  Boxes,
  Zap,
  BarChart3,
};

export const TrustSection: React.FC = () => {
  return (
    <section className="py-14 sm:py-16 bg-white border-y border-slate-200/80">
      <Container size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {siteConfig.trustItems.map((item) => {
            const IconComponent = icons[item.iconName] || ClipboardCheck;
            return (
              <div
                key={item.title}
                className="flex flex-col items-start p-5 rounded-2xl bg-slate-50/70 border border-slate-100 transition-all hover:bg-slate-50 hover:border-slate-200"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 mb-4">
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
