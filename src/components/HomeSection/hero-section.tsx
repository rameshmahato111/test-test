import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative h-[500px] w-full overflow-hidden">
      <Image
        src="/images/default-city.jpeg"
        alt="Tropical beach with pink sand and beach chair"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-pink-500/20" />
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-balance font-sans text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
            Discover. Book. Go.
            <br />
            Make every Trip Count
          </h1>
        </div>
      </div>
    </section>
  )
}
