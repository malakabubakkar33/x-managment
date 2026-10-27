import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Phone, Building2, User, Send, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Container } from '../layout/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { siteConfig } from '../../config/site';

const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Please enter your full name (at least 2 characters).' })
    .max(80, { message: 'Name must not exceed 80 characters.' }),
  pharmacyName: z
    .string()
    .min(2, { message: 'Please enter your pharmacy or store name.' })
    .max(100, { message: 'Pharmacy name must not exceed 100 characters.' }),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address (e.g., name@pharmacy.com).' }),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[+0-9\s\-()]{7,20}$/.test(val), {
      message: 'Please enter a valid phone number (digits, +, or -).',
    }),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters long.' })
    .max(1000, { message: 'Message must not exceed 1000 characters.' }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export const ContactSection: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'simulated_success' | 'error'>('idle');
  const [submittedData, setSubmittedData] = useState<ContactFormData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: '',
      pharmacyName: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmissionStatus('idle');

    // Simulate network delay for realistic form validation feedback
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Integration Boundary: In Phase 2, dispatch to POST /api/v1/inquiries
    setSubmittedData(data);
    setSubmissionStatus('simulated_success');
    setIsSubmitting(false);
    reset();
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200/80 scroll-mt-12">
      <Container size="lg">
        <SectionHeading
          badge="Inquiries &amp; Early Pilot"
          title="Contact X Management"
          subtitle="Interested in testing the pharmacy platform or discussing specialized dispensing requirements? Reach out to our engineering team."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-5xl mx-auto">
          {/* Left Column: Context & Direct Channel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-5">
              <h3 className="text-lg font-bold text-slate-900">
                Direct Contact Information
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We welcome discussions with independent pharmacy owners, hospital dispensary administrators, and retail chains preparing for digitization.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Business Email</span>
                    <a
                      href={`mailto:${siteConfig.contactEmailPlaceholder}`}
                      className="text-sm font-semibold text-brand-600 hover:underline"
                    >
                      {siteConfig.contactEmailPlaceholder}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-medical-50 text-medical-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Product Inquiries</span>
                    <span className="text-sm font-semibold text-slate-700">
                      Phase 1 Public Showcase
                    </span>
                  </div>
                </div>
              </div>

              {/* Phase 1 Form Notice */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <strong>Notice:</strong> This form operates in client-side demonstration mode for Phase 1. Submissions will validate format rules without writing to an unconfigured backend.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Accessible Validated Form */}
          <div className="lg:col-span-7">
            <div className="p-7 sm:p-9 rounded-3xl bg-white border border-slate-200 shadow-soft">
              {submissionStatus === 'simulated_success' && submittedData ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold">Inquiry Validation Successful</h4>
                      <p className="text-xs text-emerald-700">
                        Form schema verified for <span className="font-semibold">{submittedData.fullName}</span> ({submittedData.pharmacyName}).
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-emerald-800 bg-white/70 p-3.5 rounded-xl border border-emerald-100 leading-relaxed">
                    <strong>Demo Submission Acknowledgment:</strong> As this is Phase 1, no backend email server is connected. In production, this data will route to your designated inquiry queue at <span className="font-mono">{siteConfig.contactEmailPlaceholder}</span>.
                  </div>

                  <button
                    type="button"
                    onClick={() => setSubmissionStatus('idle')}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                    >
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        id="fullName"
                        placeholder="e.g. Dr. Alex Mercer"
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                          errors.fullName
                            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                            : 'border-slate-200 focus:border-brand-500 focus:ring-brand-200'
                        }`}
                        {...register('fullName')}
                        aria-invalid={errors.fullName ? 'true' : 'false'}
                        aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                      />
                    </div>
                    {errors.fullName && (
                      <p id="fullName-error" className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.fullName.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Pharmacy Name */}
                  <div>
                    <label
                      htmlFor="pharmacyName"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                    >
                      Pharmacy / Store Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        id="pharmacyName"
                        placeholder="e.g. Apex Community Pharmacy"
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                          errors.pharmacyName
                            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                            : 'border-slate-200 focus:border-brand-500 focus:ring-brand-200'
                        }`}
                        {...register('pharmacyName')}
                        aria-invalid={errors.pharmacyName ? 'true' : 'false'}
                        aria-describedby={errors.pharmacyName ? 'pharmacyName-error' : undefined}
                      />
                    </div>
                    {errors.pharmacyName && (
                      <p id="pharmacyName-error" className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.pharmacyName.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                      >
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          placeholder="pharmacist@example.com"
                          className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                            errors.email
                              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                              : 'border-slate-200 focus:border-brand-500 focus:ring-brand-200'
                          }`}
                          {...register('email')}
                          aria-invalid={errors.email ? 'true' : 'false'}
                          aria-describedby={errors.email ? 'email-error' : undefined}
                        />
                      </div>
                      {errors.email && (
                        <p id="email-error" className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.email.message}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                      >
                        Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          placeholder="+1 (555) 000-0000"
                          className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                            errors.phone
                              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                              : 'border-slate-200 focus:border-brand-500 focus:ring-brand-200'
                          }`}
                          {...register('phone')}
                          aria-invalid={errors.phone ? 'true' : 'false'}
                          aria-describedby={errors.phone ? 'phone-error' : undefined}
                        />
                      </div>
                      {errors.phone && (
                        <p id="phone-error" className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.phone.message}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                    >
                      Inquiry Details <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      placeholder="Tell us about your pharmacy setup, approximate daily customer volume, or features of interest..."
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                        errors.message
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                          : 'border-slate-200 focus:border-brand-500 focus:ring-brand-200'
                      }`}
                      {...register('message')}
                      aria-invalid={errors.message ? 'true' : 'false'}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                    ></textarea>
                    {errors.message && (
                      <p id="message-error" className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.message.message}</span>
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={isSubmitting}
                    rightIcon={isSubmitting ? undefined : <Send className="w-4 h-4" />}
                  >
                    {isSubmitting ? 'Validating Inquiry...' : 'Submit Inquiry'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
