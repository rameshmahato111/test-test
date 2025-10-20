"use client"

import { Button } from "@/components/ui/button"

export default function SecondFooterHeroSection() {
  return (
    <section className="w-full bg-gradient-to-b from-slate-50 to-white px-4 py-12 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Plan your next Adventure
              </h1>
              <p className="text-4xl md:text-5xl lg:text-6xl font-bold">
                with <span className="text-pink-500">Exploreden</span>
              </p>
            </div>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-md">
              From travel to stays, Exploreden empowers you to travel your way.
            </p>

            <div className="pt-4">
              <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-6 text-lg rounded-full font-semibold transition-colors">
                Plan A City Trip
              </Button>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="flex justify-center items-center">
            <AnimatedCarIllustration />
          </div>
        </div>
      </div>
    </section>
  )
}

function AnimatedCarIllustration() {
  return (
    <svg viewBox="0 0 600 400" className="w-full max-w-2xl h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>{`
          @keyframes driveCar {
            0% { transform: translateX(-50px); }
            50% { transform: translateX(0px); }
            100% { transform: translateX(-50px); }
          }
          
          @keyframes floatClouds {
            0% { transform: translateX(0px); }
            100% { transform: translateX(20px); }
          }
          
          .car-group {
            animation: driveCar 4s ease-in-out infinite;
            transform-origin: center;
          }
          
          .cloud {
            animation: floatClouds 6s ease-in-out infinite;
          }
        `}</style>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#5B9FBD", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#A8D5E8", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Sky Background */}
      <rect width="600" height="400" fill="url(#skyGradient)" />

      {/* Clouds */}
      <g className="cloud" style={{ animationDelay: "0s" }}>
        <ellipse cx="100" cy="60" rx="45" ry="25" fill="#FFF9E6" opacity="0.9" />
        <ellipse cx="130" cy="50" rx="50" ry="30" fill="#FFFBF0" opacity="0.9" />
        <ellipse cx="70" cy="50" rx="40" ry="25" fill="#FFF9E6" opacity="0.9" />
      </g>

      <g className="cloud" style={{ animationDelay: "2s" }}>
        <ellipse cx="450" cy="80" rx="40" ry="22" fill="#E8F4F8" opacity="0.8" />
        <ellipse cx="480" cy="75" rx="45" ry="28" fill="#F0F8FB" opacity="0.8" />
        <ellipse cx="420" cy="75" rx="35" ry="20" fill="#E8F4F8" opacity="0.8" />
      </g>

      {/* Distant Landmarks */}
      {/* Eiffel Tower */}
      <g opacity="0.7">
        <rect x="480" y="140" width="8" height="80" fill="#8B7355" />
        <polygon points="484,140 470,160 498,160" fill="#8B7355" />
        <circle cx="484" cy="155" r="12" fill="none" stroke="#8B7355" strokeWidth="2" />
      </g>

      {/* Big Ben */}
      <g opacity="0.7">
        <rect x="280" y="120" width="12" height="100" fill="#6B5B4F" />
        <rect x="275" y="115" width="22" height="8" fill="#8B7355" />
        <circle cx="286" cy="110" r="6" fill="#FFD700" />
      </g>

      {/* Statue of Liberty */}
      <g opacity="0.7">
        <rect x="80" y="150" width="6" height="70" fill="#8B7355" />
        <polygon points="83,150 70,165 96,165" fill="#FFD700" />
        <circle cx="83" cy="160" r="8" fill="#FFD700" />
      </g>

      {/* Ground */}
      <rect y="280" width="600" height="120" fill="#D4C5A0" />

      {/* Road */}
      <rect y="240" width="600" height="80" fill="#4A4A4A" />

      {/* Road Markings */}
      <line x1="0" y1="280" x2="600" y2="280" stroke="#FFD700" strokeWidth="3" strokeDasharray="30,20" />

      {/* Grass/Landscape */}
      <ellipse cx="150" cy="320" rx="60" ry="40" fill="#7CB342" opacity="0.6" />
      <ellipse cx="500" cy="330" rx="80" ry="50" fill="#7CB342" opacity="0.6" />

      {/* Tree */}
      <rect x="520" y="260" width="8" height="40" fill="#6B4423" />
      <circle cx="524" cy="250" r="25" fill="#558B2F" />

      {/* Location Pin */}
      <g>
        <circle cx="200" cy="300" r="8" fill="#E91E63" />
        <path d="M 200 310 L 195 320 L 205 320 Z" fill="#E91E63" />
      </g>

      {/* Animated Car */}
      <g className="car-group">
        {/* Car Body */}
        <rect x="200" y="250" width="120" height="50" rx="8" fill="#E8743B" />

        {/* Car Top */}
        <rect x="220" y="220" width="80" height="35" rx="6" fill="#E8743B" />

        {/* Windows */}
        <rect x="230" y="228" width="25" height="20" rx="3" fill="#87CEEB" opacity="0.7" />
        <rect x="265" y="228" width="25" height="20" rx="3" fill="#87CEEB" opacity="0.7" />

        {/* Front Bumper */}
        <rect x="200" y="295" width="120" height="8" fill="#D4623B" />

        {/* Wheels */}
        <circle cx="230" cy="310" r="12" fill="#333" />
        <circle cx="290" cy="310" r="12" fill="#333" />

        {/* Wheel Rims */}
        <circle cx="230" cy="310" r="7" fill="#666" />
        <circle cx="290" cy="310" r="7" fill="#666" />

        {/* Headlights */}
        <circle cx="205" cy="265" r="4" fill="#FFD700" />
        <circle cx="215" cy="265" r="4" fill="#FFD700" />
      </g>
    </svg>
  )
}
