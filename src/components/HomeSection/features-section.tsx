import { Calendar, Sparkles, DollarSign } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Calendar,
      title: "Seamless Booking",
      description: "Book tour packages, stays, and activities in minutes securely without any hassle.",
    },
    {
      icon: Sparkles,
      title: "Exclusive Member Rewards",
      description: "Unlock cashback, deals, and unlimited itineraries with Exploreden membership.",
    },
    {
      icon: DollarSign,
      title: "Earn from your Travel Plans",
      description: "Publish your itineraries, get featured, and earn 5% credit when others book.",
    },
  ]

  return (
    <section className="bg-white px-4 py-20">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-pink-50">
              <feature.icon className="h-12 w-12 text-pink-500" strokeWidth={1.5} />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-gray-900">{feature.title}</h3>
            <p className="text-base leading-relaxed text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
