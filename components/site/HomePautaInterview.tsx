import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

const href = "/prensa/juan-carlos-rauld-radio-pauta-desde-el-jardin-28-octubre-2026";

export function HomePautaInterview() {
  return (
    <section aria-labelledby="home-pauta-title" className="border-y border-[#d8cfc0] bg-[#f8f5ee] text-[#171713]">
      <div className="mx-auto grid max-w-[1640px] gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.7fr)] lg:items-center lg:gap-16 lg:px-14 xl:px-20">
        <div>
          <p className="text-[0.8125rem] font-semibold text-[#9f5528]">En Radio PAUTA · Desde el Jardín · 28 de octubre de 2026</p>
          <h2 id="home-pauta-title" className="crc-serif mt-3 max-w-[27ch] text-balance text-[clamp(1.6rem,2.3vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.01em]">
            Juan Carlos Rauld conversa con Cristián Warnken sobre infancia y justicia
          </h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-[1.7] text-[#55574f]">
            Una conversación sobre las consecuencias de la institucionalización y la responsabilidad ética del Estado ante la niñez.
          </p>
          <Link href={href} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-[6px] bg-[#bd6f3c] px-5 py-2.5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-[#a85f31]">
            Ver entrevista <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <Link href={href} aria-label="Ver la entrevista a Juan Carlos Rauld en Radio PAUTA" className="group relative block aspect-video overflow-hidden rounded-[6px] bg-[#15120e]">
          {/* eslint-disable-next-line @next/next/no-img-element -- imagen real del video de Radio PAUTA */}
          <img src="https://i.ytimg.com/vi/cyzIgLIOijo/maxresdefault.jpg" alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#15120e]/85 text-white transition-colors group-hover:bg-[#bd6f3c]">
              <Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden="true" />
            </span>
          </span>
        </Link>
      </div>
    </section>
  );
}
