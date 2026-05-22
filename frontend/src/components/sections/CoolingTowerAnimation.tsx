'use client';

type CoolingTowerAnimationProps = {
  locale?: string;
};

type AnimationLabels = { air: string; water: string; fill: string; fan: string };

const defaultLabels: AnimationLabels = {
  air: 'Luftstrom',
  water: 'Wasserkreislauf',
  fill: 'Fuellkoerper',
  fan: 'Ventilator',
};

const labels: Record<string, AnimationLabels> = {
  de: defaultLabels,
  en: {
    air: 'Air flow',
    water: 'Water loop',
    fill: 'Fill media',
    fan: 'Fan',
  },
};

export function CoolingTowerAnimation({ locale = 'de' }: CoolingTowerAnimationProps) {
  const text: AnimationLabels = labels[locale] ?? defaultLabels;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-sky-50 via-white to-slate-50 p-6 shadow-xl shadow-blue-100/50">
      <div className="relative mx-auto aspect-[16/9] max-w-3xl">
        <div className="absolute inset-x-[18%] bottom-[12%] h-[58%] rounded-b-2xl border-4 border-slate-700 bg-white shadow-2xl">
          <div className="absolute left-1/2 top-[-18%] h-[22%] w-[42%] -translate-x-1/2 rounded-t-2xl border-4 border-slate-700 border-b-0 bg-slate-100" />
          <div className="absolute inset-x-[18%] top-[14%] grid h-[38%] grid-cols-5 gap-1">
            {Array.from({ length: 15 }).map((_, i) => (
              <span key={i} className="rounded-sm bg-blue-200/80" />
            ))}
          </div>
          <div className="absolute inset-x-[10%] bottom-[10%] h-[14%] rounded-lg bg-blue-500/20" />
          <div className="absolute left-1/2 top-[-9%] h-12 w-12 -translate-x-1/2 rounded-full border-4 border-slate-700 bg-white">
            <div className="absolute left-1/2 top-1/2 h-8 w-1 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full bg-blue-600 [animation-duration:1.4s]" />
            <div className="absolute left-1/2 top-1/2 h-1 w-8 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full bg-blue-600 [animation-duration:1.4s]" />
          </div>
        </div>

        <div className="absolute left-[9%] top-[25%] h-[45%] w-[18%]">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="absolute left-0 h-1 w-full animate-pulse rounded-full bg-sky-400"
              style={{ top: `${i * 26}%`, animationDelay: `${i * 140}ms` }}
            />
          ))}
        </div>

        <div className="absolute right-[8%] top-[12%] h-[70%] w-[20%]">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className="absolute right-0 h-1 w-full animate-pulse rounded-full bg-slate-400"
              style={{ top: `${i * 20}%`, animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 grid grid-cols-2 gap-3 text-xs font-semibold text-slate-600 sm:grid-cols-4">
          <span>{text.air}</span>
          <span>{text.water}</span>
          <span>{text.fill}</span>
          <span>{text.fan}</span>
        </div>
      </div>
    </div>
  );
}
