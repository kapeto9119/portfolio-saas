'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Analytics component that tracks page views
 * In a real implementation, this would connect to your analytics service
 */
export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    // This would be where you'd call your analytics service
    if (pathname) {
      const url = searchParams?.size 
        ? `${pathname}?${searchParams}`
        : pathname
        
      console.log(`Page view: ${url}`)
      
      // Example of what you might do with a real analytics service:
      // analytics.track('pageview', {
      //   url,
      //   referrer: document.referrer,
      //   title: document.title,
      // })
    }
  }, [pathname, searchParams])
  
  return null
} 