import React from "react";

export const AboutSection:React.FC=()=>{
  return(
    <section id="about" className="w-full bg-white">
      <div className="max-w-[1480px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-stretch">
          <div className="bg-black rounded-2xl md:rounded-3xl p-7 md:p-10 flex flex-col justify-between min-h-[360px] photon-reveal">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                About Photon
              </span>

              <h2 className="mt-5 text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[0.95]">
                Your files.
                <br/>
                Directly there.
              </h2>
            </div>

            <p className="mt-8 max-w-xl text-sm md:text-base text-slate-300 leading-relaxed">
              Photon lets you send files from one device to another without
              uploading them to a storage service first. Create a room, share
              the code, and send your file.
            </p>
          </div>

          <div className="border border-[#222938] rounded-2xl md:rounded-3xl p-7 md:p-10 flex flex-col justify-center bg-white photon-reveal photon-reveal-delay-1">
            <h3 className="text-2xl md:text-3xl font-extrabold text-black tracking-tight">
              Simple by design.
            </h3>

            <div className="mt-8 flex flex-col gap-5">
              <div className="flex gap-4 items-start">
                <div className="w-9 h-9 rounded-full bg-[#141824] text-white flex items-center justify-center font-extrabold text-sm shrink-0">
                  01
                </div>

                <div>
                  <h4 className="font-extrabold text-black">
                    No account needed
                  </h4>
                  <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                    Open Photon and start sharing right away.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-9 h-9 rounded-full bg-[#141824] text-white flex items-center justify-center font-extrabold text-sm shrink-0">
                  02
                </div>

                <div>
                  <h4 className="font-extrabold text-black">
                    Send up to 20GB
                  </h4>

                  <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                    Share large files without splitting them into smaller
                    pieces.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-9 h-9 rounded-full bg-[#141824] text-white flex items-center justify-center font-extrabold text-sm shrink-0">
                  03
                </div>

                <div>
                  <h4 className="font-extrabold text-black">
                    Nothing to upload
                  </h4>

                  <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                    Your file goes straight between the connected devices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};