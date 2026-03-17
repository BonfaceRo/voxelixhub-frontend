"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, Sparkles, Star } from "lucide-react"

const chatMessages = [
  { type: "incoming", text: "Hi, I saw your BMW 320i listing. Is it still available?", delay: 0 },
  { type: "ai", text: "Hi there! Yes, our 2022 BMW 320i is still available! It has only 35,000km and full service history. Would you like to schedule a test drive?", delay: 1500 },
  { type: "incoming", text: "Yes please! Can I come tomorrow afternoon?", delay: 4000 },
  { type: "ai", text: "Perfect! I've booked you for tomorrow at 2pm. Our address is 123 Main Rd, Sandton. See you then! 🚗", delay: 5500 },
]

export function Hero() {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([])
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    
    chatMessages.forEach((msg, index) => {
      if (msg.type === "ai") {
        timers.push(setTimeout(() => setIsTyping(true), msg.delay - 800))
      }
      timers.push(
        setTimeout(() => {
          setIsTyping(false)
          setVisibleMessages((prev) => [...prev, index])
        }, msg.delay)
      )
    })

    // Reset and replay animation
    const resetTimer = setTimeout(() => {
      setVisibleMessages([])
      setIsTyping(false)
    }, 10000)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(resetTimer)
    }
  }, [visibleMessages.length === 0])

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">Join 500+ South African businesses</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-balance">
              Never Lose a{" "}
              <span className="gradient-text">Lead</span>{" "}
              Again
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Your AI assistant captures leads on WhatsApp 24/7—even during load shedding. 
              Respond in 5 seconds. Book appointments automatically. Close more deals.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base px-8 py-6 glow-gold"
              >
                Start Free — No Credit Card
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-border hover:bg-secondary text-foreground font-semibold text-base px-8 py-6"
              >
                Watch Demo
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap items-center gap-6 justify-center lg:justify-start">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">4.9/5 rating</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                POPIA Compliant
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                SSL Secured
              </div>
            </div>
          </div>

          {/* Right Content - Chat Demo */}
          <div className="relative">
            <div className="relative mx-auto max-w-sm">
              {/* Phone Frame */}
              <div className="relative bg-card rounded-[2.5rem] p-3 border border-border shadow-2xl">
                {/* Phone Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-background rounded-b-2xl" />
                
                {/* Screen */}
                <div className="bg-secondary rounded-[2rem] overflow-hidden">
                  {/* Chat Header */}
                  <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">SA</span>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">SA Auto Gallery</p>
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-accent" />
                        <p className="text-green-300 text-xs">AI Assistant Online</p>
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="h-80 p-4 space-y-3 overflow-hidden">
                    {chatMessages.map((msg, index) => (
                      visibleMessages.includes(index) && (
                        <div
                          key={index}
                          className={`flex ${msg.type === "incoming" ? "justify-start" : "justify-end"} animate-slide-up`}
                        >
                          <div
                            className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                              msg.type === "incoming"
                                ? "bg-white text-gray-800 rounded-tl-none"
                                : "bg-[#DCF8C6] text-gray-800 rounded-tr-none"
                            }`}
                          >
                            {msg.type === "ai" && (
                              <div className="flex items-center gap-1 mb-1">
                                <Sparkles className="w-3 h-3 text-primary" />
                                <span className="text-[10px] text-primary font-medium">AI Response</span>
                              </div>
                            )}
                            {msg.text}
                          </div>
                        </div>
                      )
                    ))}
                    
                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex justify-end animate-fade-in">
                        <div className="bg-[#DCF8C6] px-4 py-3 rounded-lg rounded-tr-none">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-float">
                5 sec response
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 -z-10 bg-primary/20 blur-3xl rounded-full scale-150" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
