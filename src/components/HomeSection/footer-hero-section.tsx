import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-sky-200 via-sky-100 to-sky-50 overflow-hidden">
      {/* Decorative clouds */}
      <div className="absolute top-8 left-12 w-20 h-12 bg-white rounded-full opacity-70 blur-sm" />
      <div className="absolute top-32 right-20 w-24 h-14 bg-white rounded-full opacity-60 blur-sm" />
      <div className="absolute bottom-32 right-10 w-16 h-10 bg-white rounded-full opacity-50 blur-sm" />

      {/* Airplane icons */}
      <div className="absolute top-16 left-1/4 text-pink-500 text-3xl animate-pulse">✈️</div>
      <div
        className="absolute top-1/3 right-1/4 text-pink-500 text-2xl animate-pulse"
        style={{ animationDelay: "0.5s" }}
      >
        ✈️
      </div>

      {/* Dashed flight paths */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.3 }}>
        <path d="M 200 150 Q 400 200 600 300" stroke="#ec4899" strokeWidth="2" fill="none" strokeDasharray="5,5" />
        <path d="M 650 250 Q 700 350 750 450" stroke="#ec4899" strokeWidth="2" fill="none" strokeDasharray="5,5" />
      </svg>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-6 sm:space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance">
                Publish your <span className="text-pink-500">itinerary</span> and{" "}
                <span className="text-pink-500">Earn</span> from every
                <br className="hidden sm:block" />
                Booking
              </h1>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-md">
                Share your itinerary on Exploreden, inspire fellow travelers, and earn whenever they book through your
                plan.
              </p>
            </div>

            <Button className="w-fit bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-full text-base sm:text-lg transition-colors">
              Start Creating Today
            </Button>
          </div>

          {/* Right Content - Illustration */}
          <div className="relative flex justify-center items-center min-h-96 sm:min-h-full">
            <div className="relative w-full max-w-2xl h-96 sm:h-full">
              {/* Booking Card */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 sm:left-0 sm:translate-x-0 bg-white rounded-3xl shadow-2xl p-5 sm:p-6 w-80 sm:w-96 z-20">
                <div className="mb-4 overflow-hidden rounded-2xl">
                  <img
                    src="/images/food.jpeg"
                    alt="Sydney The Rocks Guided Walking Tour"
                    className="w-full h-32 sm:h-40 object-cover"
                  />
                </div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-3">
                  Sydney The Rocks Guided Walking Tour
                </h3>
                <div className="space-y-2 mb-5">
                  <div className="h-2 bg-gray-300 rounded w-full" />
                  <div className="h-2 bg-gray-300 rounded w-5/6" />
                  <div className="h-2 bg-gray-300 rounded w-4/5" />
                </div>
                <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-xl text-base flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  Publish
                </Button>
              </div>

              {/* Notification Badge */}
              <div className="absolute top-40 sm:top-48 right-0 sm:right-12 bg-white rounded-2xl shadow-lg p-4 sm:p-5 flex items-center gap-3 z-30 w-72 sm:w-80">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-sm sm:text-base font-medium text-gray-800">
                  Someone booked from your itinerary.
                </div>
              </div>

             
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
