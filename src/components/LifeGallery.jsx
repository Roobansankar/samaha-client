const LIFE = ['/life-1.jpg', '/life-2.jpg', '/life-3.jpg', '/life-4.jpg', '/life-5.jpg']

export default function LifeGallery() {
  return (
    <section className="bg-paper" aria-label="In the kitchen">
      <div className="mx-auto max-w-[1500px] px-[clamp(1.75rem,5vw,5rem)] py-[clamp(2.75rem,6vw,4.5rem)]">
        <div className="mb-8">
          <p className="eyebrow">In the kitchen</p>
          <h2
            className="mt-3 font-display font-medium leading-[1.1] text-olive-900"
            style={{ fontSize: 'clamp(1.7rem, 1.2rem + 2vw, 2.6rem)' }}
          >
            A little of the everyday
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
          {LIFE.map((src, i) => (
            <div
              key={src}
              className={`group overflow-hidden rounded-[var(--radius-md)] border border-line bg-paper-2 ${
                i === 0 ? 'col-span-2 row-span-2' : 'aspect-square'
              }`}
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
