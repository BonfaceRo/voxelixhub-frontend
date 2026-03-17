"use client"

import { useEffect, useRef, useState } from "react"
import { MessageCircle, Bot, CalendarCheck } from "lucide-react"

const steps = [
  {
    icon: MessageCircle,
    number: "01",
    title: "Lead Messages You",
    description: "A potential customer sends a WhatsApp message asking about your product or service.",
  },
  {
    icon: Bot,
    number: "02",
    title: "AI Responds Instantly",
    description: "Within 5 seconds, our AI replies with helpful, natural responses—answering questions and building rapport.",
  },
  {
    icon: CalendarCheck,
    number: "03",
    title: "Appointment Booked",
    description: "The AI qualifies the lead and books them directly into your calendar. You just show up and close.",
  },
]

export function HowItWorks() {
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
    <section id="how-it-works" ref={ref} className="py-20 lg:py-32 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            From message to meeting in three simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-border">
            <div 
              className={`h-full bg-primary transition-all duration-1000 ease-out ${
                isVisible ? "w-full" : "w-0"
              }`}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative text-center transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Step Number */}
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-full bg-card border-2 border-primary flex items-center justify-center mx-auto relative z-10">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>

                {/* Mobile Connector */}
                {index < steps.length - 1 && (
                  <div className="md:hidden w-0.5 h-12 bg-border mx-auto mt-6">
                    <div 
                      className={`w-full bg-primary transition-all duration-500 ${
                        isVisible ? "h-full" : "h-0"
                      }`}
                      style={{ transitionDelay: `${(index + 1) * 200}ms` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
