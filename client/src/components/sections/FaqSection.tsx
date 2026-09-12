import React from "react";

export const FaqSection:React.FC=()=>{
  return(
    <section id="faq" className="w-full bg-white">
      <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-20 md:py-28">
        <div className="text-center mb-12 photon-reveal">
          <span className="text-xs font-extrabold uppercase tracking-widest text-red-700">
            FAQ
          </span>

          <h2 className="mt-3 text-4xl md:text-6xl font-extrabold text-black tracking-tight">
            Questions?
          </h2>

          <p className="mt-4 text-sm md:text-base text-slate-500">
            A few quick answers.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <details
            className="group border border-[#222938] rounded-2xl overflow-hidden bg-white photon-reveal photon-reveal-delay-1 transition-all duration-300 hover:border-[#11151f] open:shadow-sm"
          >
            <summary className="photon-faq-summary cursor-pointer list-none p-5 md:p-6 flex items-center justify-between gap-5 font-extrabold text-black">
              <span>Do I need to create an account?</span>
              <span className="photon-faq-icon w-8 h-8 rounded-full bg-[#141824] text-white flex items-center justify-center text-lg shrink-0">
                +
              </span>
            </summary>

            <div className="photon-faq-content">
              <div>
                <p className="px-5 md:px-6 pb-5 md:pb-6 text-sm text-slate-500 leading-relaxed">
                  No. You can start sharing files without creating an account.
                </p>
              </div>
            </div>
          </details>

          <details
            className="group border border-[#222938] rounded-2xl overflow-hidden bg-white photon-reveal photon-reveal-delay-2 transition-all duration-300 hover:border-[#11151f] open:shadow-sm"
          >
            <summary className="photon-faq-summary cursor-pointer list-none p-5 md:p-6 flex items-center justify-between gap-5 font-extrabold text-black">
              <span>How large can a file be?</span>
              <span className="photon-faq-icon w-8 h-8 rounded-full bg-[#141824] text-white flex items-center justify-center text-lg shrink-0">+</span>
            </summary>

            <div className="photon-faq-content">
              <div>
                <p className="px-5 md:px-6 pb-5 md:pb-6 text-sm text-slate-500 leading-relaxed">
                  Photon supports files up to 20GB.
                </p>
              </div>
            </div>
          </details>

          <details
            className="group border border-[#222938] rounded-2xl overflow-hidden bg-white photon-reveal photon-reveal-delay-3 transition-all duration-300 hover:border-[#11151f] open:shadow-sm"
          >
            <summary className="photon-faq-summary cursor-pointer list-none p-5 md:p-6 flex items-center justify-between gap-5 font-extrabold text-black">
              <span>Can I send a file to my phone?</span>
              <span className="photon-faq-icon w-8 h-8 rounded-full bg-[#141824] text-white flex items-center justify-center text-lg shrink-0">
                +
              </span>
            </summary>

            <div className="photon-faq-content">
              <div>
                <p className="px-5 md:px-6 pb-5 md:pb-6 text-sm text-slate-500 leading-relaxed">
                  Yes. Scan the QR code shown in the room and your phone can
                  join the room directly.
                </p>
              </div>
            </div>
          </details>

          <details
            className="group border border-[#222938] rounded-2xl overflow-hidden bg-white photon-reveal photon-reveal-delay-1 transition-all duration-300 hover:border-[#11151f] open:shadow-sm"
          >
            <summary className="photon-faq-summary cursor-pointer list-none p-5 md:p-6 flex items-center justify-between gap-5 font-extrabold text-black">
              <span>Where is my file stored?</span>
              <span className="photon-faq-icon w-8 h-8 rounded-full bg-[#141824] text-white flex items-center justify-center text-lg shrink-0">
                +
              </span>
            </summary>

            <div className="photon-faq-content">
              <div>
                <p className="px-5 md:px-6 pb-5 md:pb-6 text-sm text-slate-500 leading-relaxed">
                  Photon sends the file directly between the connected devices
                  instead of keeping a copy in an online storage service.
                </p>
              </div>
            </div>
          </details>

          <details
            className="group border border-[#222938] rounded-2xl overflow-hidden bg-white photon-reveal photon-reveal-delay-2 transition-all duration-300 hover:border-[#11151f] open:shadow-sm"
          >
            <summary className="photon-faq-summary cursor-pointer list-none p-5 md:p-6 flex items-center justify-between gap-5 font-extrabold text-black">
              <span>What happens when I disconnect?</span>
              <span className="photon-faq-icon w-8 h-8 rounded-full bg-[#141824] text-white flex items-center justify-center text-lg shrink-0">+</span>
            </summary>

            <div className="photon-faq-content">
              <div>
                <p className="px-5 md:px-6 pb-5 md:pb-6 text-sm text-slate-500 leading-relaxed">
                  The current room connection is closed and the session is
                  reset.
                </p>
              </div>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
};