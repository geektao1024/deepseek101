'use client'

import React from 'react'
import PropTypes from 'prop-types'
import { ExternalLink } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function VisitButton({ url }) {
  const handleVisit = () => {
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-1.5">
      <Button 
        variant="default"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white h-10"
        onClick={handleVisit}
      >
        <div className="flex items-center justify-center gap-2 text-sm font-medium">
          <span>Visit</span>
          <ExternalLink className="w-4 h-4 flex-shrink-0" />
        </div>
      </Button>
      <div className="text-xs text-gray-500 text-center">
        by {url}
      </div>
    </div>
  )
}

VisitButton.propTypes = {
  url: PropTypes.string.isRequired
} 