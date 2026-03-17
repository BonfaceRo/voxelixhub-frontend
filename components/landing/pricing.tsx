"use client"

import { useEffect, useRef, useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Starter",
    price: "R499",
    period: "/month",
    description: "Perfect for small businesses just getting started",
    features: [
      "Up to 100 leads/month",
      "WhatsApp integration",
      "Basic AI responses",
      "Email support",
      "1 team member",
    ],
    cta: "Start Free — No Credit Card",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "R999",
    period: "/month",
    description: "For growing businesses that need more power",
    features: [
      "Up to 500 leads/month",
      "WhatsApp + SMS integration",
      "Advanced AI with learning",
      "Auto appointment booking",
      "Priority support",
      "5 team members",
      "Custom AI training",
    ],
    cta: "Start Free — No Credit Card",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "R1999",
    period: "/month",
    description: "For established businesses with high volume",
    features: [
      "Unlimited leads",
      "All integrations",
      "Premium AI with full customization",
      "Multi-location support",
      "Dedicated account manager",
      "Unlimited team members",
      "API access",
      "White-label option",
    ],
    cta: "Start Free — No Credit Card",
    highlighted: false,
  },
]

export function Pricing() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
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
    <section id="pricing" ref={ref} className="py-20 lg:py-32 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            14-day free trial on all plans. No credit card required.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 transition-all duration-700 ${
                plan.highlighted
                  ? "bg-card border-2 border-primary glow-purple lg:scale-105 lg:-my-4"
                  : "bg-card border border-border"
              } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-accent-foreground text-sm font-bold">
                  {plan.badge}
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="font-serif text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-primary" : "text-accent"}`} />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.highlighted
                    ? "bg-accent hover:bg-accent/90 text-accent-foreground"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground"
                }`}
                size="lg"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Trust Note */}
        <p className="text-center mt-12 text-sm text-muted-foreground">
          All plans include SSL security, POPIA compliance, and automatic backups.
        </p>
      </div>
    </section>
  )
}
