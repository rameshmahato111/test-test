"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface MasonryItem {
  id: number
  type: "image" | "testimonial"
  size: "small" | "medium" | "large"
  image?: string
  testimonial?: string
  author?: string
  role?: string
  color?: string
}

const generateMasonryItems = (startId: number, count: number): MasonryItem[] => {
  const items: MasonryItem[] = []
  const testimonials = [
    {
      text: "I started creating and sharing itineraries on Exploreden during my free time at home. It felt like a hobby at first, but soon I was earning credits whenever people booked from my plans.",
      author: "Jane Doe",
      role: "University Student at Isabella",
      color: "from-pink-500 to-rose-600",
    },
    {
      text: "The platform made it incredibly easy to monetize my travel expertise. Within months, I had built a sustainable income stream.",
      author: "John Smith",
      role: "Travel Enthusiast",
      color: "from-amber-500 to-orange-600",
    },
    {
      text: "Amazing experience! The community is supportive and the earning potential is real.",
      author: "Sarah Johnson",
      role: "Content Creator",
      color: "from-teal-500 to-cyan-600",
    },
  ]

  const images = [
    "/images/card-1.png",
    "/images/card-2.png",
    "/images/card-3.png",
    "/images/city_landscape.jpg",
    "/images/city-1.png",
    "/images/city-2.png",
  ]

  for (let i = 0; i < count; i++) {
    const id = startId + i
    const isTestimonial = i % 4 === 2 || i % 4 === 3
    const sizeRandom = Math.random()

    if (isTestimonial) {
      items.push({
        id,
        type: "testimonial",
        size: sizeRandom > 0.6 ? "large" : "medium",
        testimonial: testimonials[i % testimonials.length].text,
        author: testimonials[i % testimonials.length].author,
        role: testimonials[i % testimonials.length].role,
        color: testimonials[i % testimonials.length].color,
      })
    } else {
      items.push({
        id,
        type: "image",
        size: sizeRandom > 0.7 ? "large" : sizeRandom > 0.4 ? "medium" : "small",
        image: images[i % images.length],
      })
    }
  }

  return items
}

export function MasonryGrid() {
  const [items, setItems] = useState<MasonryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const isInView = useInView(loadMoreRef, { once: false, margin: "200px" })

  // Initialize with first batch
  useEffect(() => {
    setItems(generateMasonryItems(0, 12))
  }, [])

  // Load more items when sentinel comes into view
  useEffect(() => {
    if (isInView && !isLoading) {
      setIsLoading(true)
      // Simulate network delay
      setTimeout(() => {
        setItems((prev) => [...prev, ...generateMasonryItems(prev.length, 8)])
        setIsLoading(false)
      }, 300)
    }
  }, [isInView, isLoading])

  useEffect(() => {
    if (!containerRef.current || isHovering) return

    const scroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10

        if (isAtBottom) {
          // Scroll to top smoothly
          containerRef.current.scrollTop = 0
        } else {
          containerRef.current.scrollTop += 2
        }
      }
      animationFrameRef.current = requestAnimationFrame(scroll)
    }

    animationFrameRef.current = requestAnimationFrame(scroll)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isHovering])

  return (
    <div className="relative w-full max-h-screen">
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background via-background/50 to-transparent pointer-events-none z-10 backdrop-blur-sm" />

      <div
        ref={containerRef}
        className="w-full max-h-screen overflow-y-auto scrollbar-hide"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4 px-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: (index % 8) * 0.05,
                ease: "easeOut",
              }}
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              className="break-inside-avoid"
            >
              {item.type === "image" ? (
                <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={`Gallery item ${item.id}`}
                    className={`w-full object-cover ${
                      item.size === "large" ? "h-96" : item.size === "medium" ? "h-64" : "h-48"
                    }`}
                  />
                </Card>
              ) : (
                <Card
                  className={`p-6 h-full flex flex-col justify-between bg-gradient-to-br ${item.color} text-white hover:shadow-lg transition-shadow duration-300`}
                >
                  <p className="text-sm leading-relaxed mb-4">{item.testimonial}</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-white/30">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.author}`} />
                      <AvatarFallback>{item.author?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{item.author}</p>
                      <p className="text-xs opacity-90">{item.role}</p>
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>
          ))}
        </div>

        {/* Infinite scroll sentinel */}
        <div ref={loadMoreRef} className="mt-12 flex justify-center">
          {isLoading && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-8 h-8 border-3 border-muted border-t-primary rounded-full"
            />
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none z-10 backdrop-blur-sm" />
    </div>
  )
}
