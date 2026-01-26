"use client";

import { useState, useEffect } from 'react';

const PHONE = "+17082037932";

function getSmsLink(phone: string, body: string) {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const encodedBody = encodeURIComponent(body);
  return isIOS ? `sms:${phone}&body=${encodedBody}` : `sms:${phone}?body=${encodedBody}`;
}

async function triggerVCardDownload() {
  const link = document.createElement("a");
  link.href = "/api/contact";
  link.download = "Antonia_Gianakas.vcf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [dimensionalState, setDimensionalState] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDimensionalState(prev => (prev + 1) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const onSaveAndText = async () => {
    setIsLoading(true);
    try {
      await triggerVCardDownload();
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 4000);
    } catch {}
    
    const smsBody = "� YOOO Antonia! That Charizard business card is absolutely INSANE! The neon orange is revolutionary AF. Let's connect and make some fire moves together! 🚀";
    const sms = getSmsLink(PHONE, smsBody);
    
    setTimeout(() => {
      window.location.href = sms;
      setIsLoading(false);
    }, 800);
  };

  return (
    <>
      <div className="dimensional-matrix" />
      <main className="min-h-screen w-full flex items-center justify-center px-4 py-8 relative z-10">
        <section className="max-w-lg w-full">
          <div className="holographic-card p-8">
            {/* Charizard Header */}
            <header className="mb-8 text-center relative">
              <div className="inline-block px-6 py-3 bg-gradient-to-r from-orange-600/20 via-red-600/15 to-orange-500/20 rounded-full border border-orange-500/50 mb-6 relative overflow-hidden">
                <span className="relative z-10 text-lg font-bold text-white uppercase tracking-wide">🔥 Charizard Contact 🔥</span>
              </div>
              
              <div className="relative">
                <h1 className="text-5xl font-black dimensional-text mb-4 relative z-10">
                  Antonia
                  <br />
                  <span className="text-4xl">Gianakas</span>
                </h1>
              </div>
              
              <div className="flex justify-center space-x-4 mt-4">
                <div className="w-8 h-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full" />
                <div className="w-12 h-1 bg-gradient-to-r from-red-500 to-orange-600 rounded-full" />
                <div className="w-6 h-1 bg-gradient-to-r from-orange-600 to-red-400 rounded-full" />
              </div>
            </header>

            {/* Contact Matrix */}
            <div className="space-y-4 mb-8">
              <div className="dimensional-row">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold text-sm uppercase tracking-wide flex items-center">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3" />
                    First Name
                  </span>
                  <span className="text-white font-bold text-xl">Antonia</span>
                </div>
              </div>
              
              <div className="dimensional-row">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold text-sm uppercase tracking-wide flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3" />
                    Last Name
                  </span>
                  <span className="text-white font-bold text-xl">Gianakas</span>
                </div>
              </div>
              
              <div className="dimensional-row">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold text-sm uppercase tracking-wide flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                    Phone
                  </span>
                  <a 
                    href={`tel:${PHONE}`} 
                    className="dimensional-text font-bold text-xl hover:scale-105 transition-all duration-200 relative"
                  >
                    708.203.7932
                  </a>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mb-8">
              <button 
                onClick={onSaveAndText} 
                disabled={isLoading}
                className="quantum-button w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 relative group"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="font-bold">Saving Contact...</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-bold">Contact Saved!</span>
                  </>
                ) : (
                  <>
                    <span className="font-bold">🔥 Save Contact & Text 🔥</span>
                  </>
                )}
              </button>
            </div>

            {/* Footer */}
            <footer className="text-center space-y-3 px-4 relative">
              <p className="text-white text-sm font-medium uppercase tracking-wide">
                Built in <span className="text-orange-400">America</span>, on <span className="text-orange-400">Earth</span>
              </p>
              
              <p className="text-white text-base italic font-medium">
                Making relationships built to last, the Charizard Way.
              </p>
              
              <div className="flex justify-center space-x-4 mt-4">
                <div className="w-2 h-2 bg-orange-400 rounded-full" />
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <div className="w-2 h-2 bg-orange-600 rounded-full" />
              </div>
            </footer>
          </div>
        </section>
      </main>
    </>
  );
}