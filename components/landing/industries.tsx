"use client"

import { useEffect, useRef, useState } from "react"
import { Car, Home, Dumbbell, Scissors, UtensilsCrossed } from "lucide-react"

const industries = [
  {
    icon: Car,
    title: "Car Dealerships",
    description: "Capture test drive requests. Answer availability questions. Book viewings automatically.",
    stat: "47% more test drives",
  },
  {
    icon: Home,
    title: "Real Estate",
    description: "Qualify buyers instantly. Schedule property viewings. Follow up on open house leads.",
    stat: "3x more viewings",
  },
  {
    icon: Dumbbell,
    title: "Gyms & Fitness",
    description: "Convert enquiries into trial sessions. Answer membership questions 24/7.",
    stat: "62% membership growth",
  },
  {
    icon: Scissors,
    title: "Salons & Spas",
    description: "Book appointments round the clock. Send reminders. Reduce no-shows.",
    stat: "35% fewer no-shows",
  },
  {
    icon: UtensilsCrossed,
    title: "Restaurants",
    description: "Take reservations automatically. Answer menu questions. Handle special requests.",
    stat: "2x table bookings",
  },
]

export function Industries() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          industries.forEach((_, index) => {
            setTimeout(() => {
              setVisibleCards((prev) => [...prev, index])
            }, index * 100)
          })
        }
      },
      { threshold: 0.2 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="industries" ref={ref} className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            Designed for <span className="gradient-text">Growing Businesses</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you sell cars or cut hair, VoxelixHub helps you capture more leads
          </p>
        </div>

        {/* Industries Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {industries.map((industry, index) => (
            <div
              key={industry.title}
              className={`group relative p-6 rounded-2xl bg-card border border-border transition-all duration-500 hover:border-accent/50 hover:-translate-y-1 ${
                visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-2xl bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10 mb-4 group-hover:bg-accent/20 transition-colors">
                  <industry.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                  {industry.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {industry.description}
                </p>
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {industry.stat}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
