import React from 'react';
import { Home, FileQuestion } from 'lucide-react';
import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 flex items-center justify-center">
      <Container size="sm">
        <div className="text-center p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-soft">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-6">
            <FileQuestion className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-2">
            Error 404
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-600 max-w-sm mx-auto mb-8 leading-relaxed">
            The page you are looking for does not exist or may have been moved. Return to the homepage to explore the X Management platform.
          </p>
          <div className="flex justify-center">
            <Button
              to="/"
              variant="primary"
              size="md"
              leftIcon={<Home className="w-4 h-4" />}
            >
              Return to Homepage
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};
