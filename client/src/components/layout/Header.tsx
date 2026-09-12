import React from "react";
import { Power, HeartPulse } from "lucide-react";

interface HeaderProps {
  isScrolled: boolean;
  roomCode: string;
  activeChannel: RTCDataChannel | null;
  onDisconnect: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isScrolled,
  roomCode,
  activeChannel,
  onDisconnect,
  onOpenSettings,
}) => {
  return (
    <div
      className={`
      sticky top-0 z-40 w-full
      transition-all duration-300 ease-out
      ${
        isScrolled
          ? `
            bg-white/75
            backdrop-blur-xl
            supports-[backdrop-filter]:bg-white/65
            border-b border-black/10
            shadow-[0_4px_20px_rgba(0,0,0,0.04)]
          `
          : `
            bg-white
            border-b border-transparent
          `
      }
    `}
    >
      <header className="max-w-[1480px] mx-auto px-4 md:px-8 py-3 md:py-4">
        <div className="flex items-center justify-between gap-6">
          <div
            className="flex items-center cursor-pointer select-none shrink-0"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            <span className="text-3xl md:text-[34px] font-extrabold text-black tracking-tight">
              Photon
            </span>
          </div>
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center">
            <div
              className={`
              flex items-center gap-1
              p-1
              max-h-11
              rounded-full
              transition-all duration-300
              ${isScrolled ? "bg-white" : "bg-white border-[#dedede]"}
            `}
            >
              <a
                href="#about"
                className="
                px-6 py-3
                rounded-full
                text-sm font-extrabold
                text-black
                whitespace-nowrap
                transition-all duration-200
                hover:bg-black hover:text-white
              "
              >
                About
              </a>

              <a
                href="#how-it-works"
                className="
                px-6 py-3
                rounded-full
                text-sm font-extrabold
                text-black
                whitespace-nowrap
                transition-all duration-200
                hover:bg-black hover:text-white
              "
              >
                How To Use
              </a>

              <a
                href="#faq"
                className="
                px-6 py-3
                rounded-full
                text-sm font-extrabold
                text-black
                whitespace-nowrap
                transition-all duration-200
                hover:bg-black hover:text-white
              "
              >
                FAQ
              </a>
            </div>
          </nav>
          <div className="flex items-center gap-2.5 shrink-0">
            <div
              className="
              flex items-center gap-2
              px-3.5 py-2
              bg-[#141824]
              border border-[#222938]
              rounded-full
            "
            >
              <span
                className={`w-9 h-4 rounded-full shrink-0 ${
                  activeChannel
                    ? "bg-emerald-500 shadow-[0_0_8px_#10b981]"
                    : roomCode
                      ? "bg-amber-400 shadow-[0_0_8px_#f59e0b]"
                      : "bg-rose-500"
                }`}
              />

              <div className="flex flex-col">
                <span className="text-xs font-extrabold text-white tracking-wider leading-none">
                  {roomCode ? roomCode : "STANDBY"}
                </span>
              </div>
            </div>
            {(roomCode || activeChannel) && (
              <button
                className="
                w-9 h-9
                rounded-full
                bg-black
                text-white
                flex items-center justify-center
                transition-all duration-200
                hover:bg-red-700
                hover:text-white
              "
                onClick={onDisconnect}
                title="Disconnect & Reset Session"
              >
                <Power size={15} />
              </button>
            )}
            <button
              className="
              w-9 h-9
              rounded-full
              bg-black
              text-white
              flex items-center justify-center
              transition-all duration-200
              hover:bg-red-700
              hover:text-white
            "
              onClick={onOpenSettings}
              title="Health"
            >
              <HeartPulse size={16} />
            </button>
          </div>
        </div>
        <nav className="md:hidden mt-3">
          <div
            className={`
            flex items-center gap-1 p-1
            rounded-full border
            transition-all duration-300
            ${
              isScrolled
                ? "bg-white/60 border-black/10 backdrop-blur-md"
                : "bg-[#f5f5f5] border-[#dedede]"
            }
          `}
          >
            <a
              href="#about"
              className="
              flex-1 text-center
              px-3 py-2.5
              rounded-full
              text-xs font-extrabold text-black
              transition-all duration-200
              hover:bg-black hover:text-white
            "
            >
              About
            </a>

            <a
              href="#how-it-works"
              className="
              flex-1 text-center
              px-3 py-2.5
              rounded-full
              text-xs font-extrabold text-black
              transition-all duration-200
              hover:bg-black hover:text-white
            "
            >
              How To Use
            </a>

            <a
              href="#faq"
              className="
              flex-1 text-center
              px-3 py-2.5
              rounded-full
              text-xs font-extrabold text-black
              transition-all duration-200
              hover:bg-black hover:text-white
            "
            >
              FAQ
            </a>
          </div>
        </nav>
      </header>
    </div>
  );
};

