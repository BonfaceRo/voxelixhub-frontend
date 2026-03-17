"use client"
import { useState } from "react"
import { MessageCircle, X } from "lucide-react"

export function WhatsAppBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const url = "https://wa.me/27630256630?text=Hi%21%20I%20am%20interested%20in%20VoxelixHub."

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-4 w-72 border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center">
                <MessageCircle size={18} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">VoxelixHub Support</p>
                <p className="text-xs text-green-500">Online now</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>
          <div className="bg-green-50 dark:bg-green-950 rounded-xl p-3 mb-3">
            <p className="text-sm leading-relaxed">
              Hi there! Ready to never lose a lead again? Chat with us on WhatsApp!
            </p>
          </div>
          <a href={url} target="_blank" rel="noopener noreferrer" className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors block text-center">
            Chat on WhatsApp
          </a>
          <p className="text-xs text-center mt-2 text-gray-400">
            Replies within 5 minutes
          </p>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-all">
        {isOpen ? <X size={24} className="text-white" /> : <MessageCircle size={26} className="text-white" />}
      </button>
    </div>
  )
}
