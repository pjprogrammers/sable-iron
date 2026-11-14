export default function Marquee() {
  const items = [
    "Haircuts",
    "Skin fades",
    "Hot-towel shaves",
    "Beard sculpting",
    "Walk-ins welcome",
    "Espresso on the house",
  ];

  return (
    <div
      className="relative overflow-hidden border-y border-ink/20 bg-brass text-[#15110b]"
      aria-hidden="true"
    >
      <div className="flex w-full">
        <div className="flex w-full flex-wrap items-center justify-center gap-x-[clamp(1.1rem,2.6vw,2.2rem)] gap-y-[0.45rem] px-gutter py-[0.8rem] max-[1200px]:gap-x-[1.4rem] max-[720px]:gap-x-[1.15rem]">
          {items.map((item, index) => (
            <span key={item} className="contents">
              <span className="whitespace-nowrap text-[0.72rem] font-bold uppercase tracking-[0.16em]">
                {item}
              </span>
              {index < items.length - 1 ? (
                <i className="text-[0.625rem] not-italic opacity-50 max-[1200px]:hidden">
                  ◆
                </i>
              ) : null}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
