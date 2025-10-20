

import React from "react";
import HeroSearch from "./HeroSearch";
import Extras from "@/services/api/extras";
import Image from "next/image";


const Hero = async () => {

  const getHeroImage = await Extras.getHeroImage();
  return (
    <div className=" bg-primary-100 z-40 relative h-full min-h-[620px]  lg:min-h-[510px] flex flex-col justify-center items-center">
      <Image
        fetchPriority="high"
        loading="lazy"
        aria-label="hero background"
        aria-describedby="hero-background-description"
        src={getHeroImage}
        alt="hero background"
        width={1240}
        height={620}
        className="absolute top-0 left-0 w-full h-full z-0 object-cover"
      />

      <div className="w-full max-w-[1240px]">
        <h1 className="font-inter text-3xl relative z-10 text-center md:text-4xl lg:text-5xl font-semibold text-background pb-9">
          Book your Hotel with Exploreden
        </h1>
        <HeroSearch />

      </div>
    </div>
  );
};

export default Hero;
