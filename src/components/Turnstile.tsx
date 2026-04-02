"use client"

import { useEffect, useRef, useCallback } from "react"
import Script from "next/script"

interface TurnstileProps {
  onVerify: (token: string) => void
  onExpire?: () => void
}

export default function Turnstile({ onVerify, onExpire }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  const renderWidget = useCallback(() => {
    if (!containerRef.current || !siteKey || widgetIdRef.current !== null) return
    if (typeof window === "undefined" || !(window as any).turnstile) return

    widgetIdRef.current = (window as any).turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: onVerify,
      "expired-callback": onExpire,
      theme: "light",
      size: "normal",
    })
  }, [siteKey, onVerify, onExpire])

  useEffect(() => {
    if ((window as any).turnstile) renderWidget()
    return () => {
      if (widgetIdRef.current !== null && (window as any).turnstile) {
        (window as any).turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [renderWidget])

  if (!siteKey) return null

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        onLoad={renderWidget}
      />
      <div ref={containerRef} />
    </>
  )
}
