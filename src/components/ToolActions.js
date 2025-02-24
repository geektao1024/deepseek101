'use client'

import React from 'react'
import PropTypes from 'prop-types'
import { Share2, Flag } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function ToolActions({ url }) {
  const handleShare = () => {
    // 实现分享功能
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href
      })
    } else {
      // 降级到复制链接
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleReport = () => {
    // 实现举报功能
    console.log('Report clicked')
  }

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline"
        className="flex-1 h-10"
        onClick={handleShare}
      >
        <div className="flex items-center justify-center gap-2 text-sm font-medium">
          <Share2 className="w-4 h-4 flex-shrink-0" />
          <span>分享</span>
        </div>
      </Button>
      <Button 
        variant="outline"
        className="flex-1 h-10"
        onClick={handleReport}
      >
        <div className="flex items-center justify-center gap-2 text-sm font-medium">
          <Flag className="w-4 h-4 flex-shrink-0" />
          <span>举报</span>
        </div>
      </Button>
    </div>
  )
}

ToolActions.propTypes = {
  url: PropTypes.string.isRequired
} 