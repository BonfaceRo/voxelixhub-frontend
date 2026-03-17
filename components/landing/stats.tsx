"use client"

import { useEffect, useRef, useState } from "react"
import { TrendingUp, Clock, Zap, Wallet } from "lucide-react"

const stats = [
  {
    icon: Wallet,
    value: "R49,850",
    label: "Average saved per month",
    suffix: "",
  },
  {
    icon: TrendingUp,
    value: "3",
    label: "Times more conversions",
    suffix: "x",
  },
  {
    icon: Clock,
    value: "24/7",
    label: "Always-on support",
    suffix: "",
  },
  {
    icon: Zap,
    value: "5",
    label: "Second response time",
    suffix: " sec",
  },
]

export function Stats() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="relative py-16 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                {stat.value}
                <span className="text-accent">{stat.suffix}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
