import React from "react";

export const Footer:React.FC=()=>{
  return(
    <footer className="w-full bg-black border-t border-[#222938]">
      <div className="max-w-[1480px] mx-auto px-4 md:px-8 py-10">
        <div className="w-full">
          <span className="text-2xl font-extrabold text-white">Photon</span>

          <p className="mt-2 text-xs text-slate-500">
            Direct peer-to-peer file transfer.
          </p>

          <div className="mt-6 flex flex-wrap gap-5 text-xs font-bold text-slate-500">
            <a href="#how-it-works" className="hover:text-white transition">
              How It Works
            </a>
            <a href="#about" className="hover:text-white transition">
              About
            </a>

            <a href="#security" className="hover:text-white transition">
              Security
            </a>
            <a href="#faq" className="hover:text-white transition">
              FAQ
            </a>
          </div>

          <div className="mt-8 pt-5 border-t border-[#222938] flex flex-col sm:flex-row justify-between gap-2 text-[11px] text-slate-600">
            <span>© {new Date().getFullYear()} Photon</span>
            <a href="https://github.com/aftabbhussain"><span>Aftab Hussain</span></a>
          </div>
        </div>
      </div>
    </footer>
  );
};