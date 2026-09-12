import React from "react";

export const HowItWorksSection:React.FC=()=>{
  return(
    <section id="how-it-works" className="w-full bg-[#f5f5f5] border-y border-[#e5e5e5]">
      <div className="max-w-[1480px] mx-auto px-4 md:px-8 py-20 md:py-28">
        <div className="max-w-2xl mb-12 photon-reveal">
          <span className="text-xs font-extrabold uppercase tracking-widest text-red-700">
            How to use
          </span>

          <h2 className="mt-3 text-4xl md:text-6xl font-extrabold text-black tracking-tight leading-tight">
            Three steps.
            <br/>
            That's it.
          </h2>

          <p className="mt-5 text-sm md:text-base text-slate-600 leading-relaxed">
            No complicated setup. Just create a room, connect another device,
            and choose your file.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div
            className="bg-white border border-[#222938] rounded-2xl md:rounded-3xl p-7 md:p-8 min-h-[280px] flex flex-col justify-between photon-reveal photon-reveal-delay-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-4xl md:text-5xl font-extrabold text-black">
                01
              </span>

              <span className="px-3 py-1.5 rounded-full bg-[#141824] text-white text-[10px] font-extrabold uppercase tracking-wider">
                Start
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-black">
                Create a room
              </h3>

              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                Click{" "}
                <span className="font-bold text-black">Create Room</span>.
                Photon gives you a short room code to share.
              </p>
            </div>
          </div>

          <div
            className="bg-black rounded-2xl md:rounded-3xl p-7 md:p-8 min-h-[280px] flex flex-col justify-between photon-reveal photon-reveal-delay-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-4xl md:text-5xl font-extrabold text-white">
                02
              </span>

              <span className="px-3 py-1.5 rounded-full bg-white text-black text-[10px] font-extrabold uppercase tracking-wider">
                Connect
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-white">
                Join the room
              </h3>

              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Enter the code on the other device or scan the QR code with
                your phone.
              </p>
            </div>
          </div>

          <div
            className="bg-white border border-[#222938] rounded-2xl md:rounded-3xl p-7 md:p-8 min-h-[280px] flex flex-col justify-between photon-reveal photon-reveal-delay-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-4xl md:text-5xl font-extrabold text-black">
                03
              </span>

              <span className="px-3 py-1.5 rounded-full bg-red-700 text-white text-[10px] font-extrabold uppercase tracking-wider">
                Send
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-black">
                Choose your file
              </h3>

              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                Drop a file or click{" "}
                <span className="font-bold text-black">Browse Files</span>.
                Photon takes care of the rest.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};