'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, BookOpen } from 'lucide-react';
import { createCatalogRequest } from '@ensotek/core/services';
import { API_BASE_URL } from '@/lib/utils';

interface Props {
  open: boolean;
  onClose: () => void;
  locale: string;
}

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20';
const labelCls = 'block text-xs font-semibold text-slate-600 mb-1.5';

export function CatalogModal(props: Props) {
  return props.open ? <CatalogModalContent {...props} /> : null;
}

function CatalogModalContent({ open, onClose, locale }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      await createCatalogRequest(API_BASE_URL, {
        customer_name: name,
        company_name: company || null,
        email,
        phone: phone || null,
        message: message || null,
        locale,
        consent_terms: consentTerms,
        consent_marketing: consentMarketing,
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <BookOpen size={18} className="text-blue-600" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                {locale === "en" ? "Request catalog" : "Katalog anfordern"}
              </h2>
              <p className="text-xs text-slate-500">{locale === "en" ? "Free and without obligation" : "Kostenlos & unverbindlich"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label={locale === 'en' ? 'Close' : 'Schließen'}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                <span className="text-green-600 text-3xl">✓</span>
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                {locale === "en" ? "Thank you!" : "Vielen Dank!"}
              </h3>
              <p className="text-slate-500 text-sm mb-6">
                {locale === "en" ? "We received your request. Our team will send you the catalog." : "Wir haben Ihre Anfrage erhalten und senden Ihnen den Katalog schnellstmöglich zu."}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors"
              >
                {locale === "en" ? "Close" : "Schließen"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name + Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-label={locale === "en" ? "Full name" : "Name"} placeholder={locale === "en" ? "Full name" : "Name"}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>{locale === "en" ? "Company" : "Unternehmen"}</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    aria-label={locale === "en" ? "Company" : "Unternehmen"} placeholder={locale === "en" ? "Company" : "Unternehmen"}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>
                    E-Mail <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Email" placeholder="name@example.com"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>{locale === "en" ? "Phone" : "Telefon"}</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    aria-label={locale === "en" ? "Phone" : "Telefon"} placeholder="+49 …"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className={labelCls}>{locale === "en" ? "Message (optional)" : "Nachricht (optional)"}</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  aria-label={locale === "en" ? "Message" : "Nachricht"} placeholder={locale === "en" ? "Tell us which product or application you need the catalog for…" : "Teilen Sie uns mit, für welchen Bereich Sie den Katalog benötigen…"}
                  className={`${inputCls} resize-none`}
                />
              </div>

              {/* Consents */}
              <div className="flex flex-col gap-2.5 pt-1">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={consentTerms}
                    onChange={(e) => setConsentTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0"
                  />
                  <span className="text-xs text-slate-600 leading-snug">
                    {locale === 'en' ? 'I have read the ' : 'Ich habe die '}
                    <a href={locale === "en" ? "/en/legal/privacy-policy" : "/de/legal/datenschutzerklaerung"} className="underline" target="_blank" rel="noopener noreferrer">{locale === "en" ? "privacy information" : "Datenschutzhinweise"}</a>{' '}
                    {locale === 'en' ? ' and agree to data processing for my catalog request.' : ' gelesen und stimme der Datenverarbeitung für meine Kataloganfrage zu.'}
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentMarketing}
                    onChange={(e) => setConsentMarketing(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0"
                  />
                  <span className="text-xs text-slate-600 leading-snug">
                    {locale === "en" ? "I would like to receive news and product information by email." : "Ja, ich möchte Neuigkeiten und Produktinformationen per E-Mail erhalten."}
                  </span>
                </label>
              </div>

              {status === 'error' && (
                <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
                  {locale === "en" ? "Could not send your request. Please try again." : "Fehler beim Senden. Bitte versuchen Sie es erneut."}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-1"
              >
                <Send size={15} />
                {status === 'loading' ? (locale === 'en' ? 'Sending…' : 'Wird gesendet…') : (locale === 'en' ? 'Request catalog' : 'Katalog anfordern')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
