"use client"

import { useEffect, useRef, useState } from "react"
import { MessageSquare, Bot, Calendar, BarChart3, Globe2, Zap } from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    title: "WhatsApp Integration",
    description: "Capture every lead that messages your business on WhatsApp. SA's favourite messaging app, fully automated.",
  },
  {
    icon: Bot,
    title: "AI-Powered Responses",
    description: "Our AI understands context and responds naturally. Your customers won't know they're chatting with a bot.",
  },
  {
    icon: Calendar,
    title: "Auto Booking",
    description: "Automatically schedule appointments, test drives, viewings, and consultations. No back-and-forth needed.",
  },
  {
    icon: BarChart3,
    title: "Lead Analytics",
    description: "See exactly where your leads come from, what they want, and how to close them faster.",
  },
  {
    icon: Globe2,
    title: "Multi-Language Support",
    description: "Respond in English, Afrikaans, Zulu, Xhosa, and more. Reach every South African customer.",
  },
  {
    icon: Zap,
    title: "Load Shedding Proof",
    description: "Our cloud-based system runs 24/7. Never miss a lead, even when the lights go out.",
  },
]

export function Features() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          features.forEach((_, index) => {
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
    <section id="features" ref={ref} className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            Everything You Need to{" "}
            <span className="gradient-text">Capture & Convert</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed specifically for South African businesses
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group relative p-6 rounded-2xl bg-card border border-border transition-all duration-500 hover:border-primary/50 ${
                visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 glow-purple" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
