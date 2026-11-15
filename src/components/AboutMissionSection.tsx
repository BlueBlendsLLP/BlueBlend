export function AboutMissionSection() {
  const pillars = [
    {
      index: '01.',
      title: 'Design Systems & Visual Hierarchy',
      detail:
        'Master responsive grid geometry, typographic rhythm, and crisp user interfaces.',
    },
    {
      index: '02.',
      title: 'Distributed & Scalable Architecture',
      detail:
        'Design fault-tolerant APIs, databases, and low-latency backend pipelines.',
    },
    {
      index: '03.',
      title: 'Core Systems & Applied Coding',
      detail:
        'Build production software with structured exercises in modern C++ and Python.',
    },
  ];

  return (
    <section
      id="about"
      className="py-16 lg:py-24 bg-[#F3F3F3] border-b border-black/[0.08]"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-6 space-y-5">
            <p className="text-xs font-medium tracking-wide text-[#005EFF]">
              Our Mission
            </p>
            <h2
              className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#0D0D0D] leading-tight"
              style={{ textWrap: 'balance' }}
            >
              Empowering Digital Minds
            </h2>
            <p className="text-base sm:text-lg text-[#626262] leading-relaxed max-w-[60ch]">
              At BlueBlends, we believe that innovation thrives where creativity
              meets technology. Our mission is to provide designers and coders
              with the high-quality educational resources needed to master the
              digital landscape and build the future.
            </p>
          </div>

          <div className="lg:col-span-6 divide-y divide-black/[0.08] border-y border-black/[0.08]">
            {pillars.map((pillar) => (
              <div
                key={pillar.index}
                className="py-5 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-5"
              >
                <span className="font-mono text-sm font-medium text-[#005EFF] tabular-nums shrink-0">
                  {pillar.index}
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-[#0D0D0D]">
                    {pillar.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#626262] leading-relaxed">
                    {pillar.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
