"use client"

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { useState } from "react"

interface PayPalBookingButtonProps {
  bookingType: "car" | "villa" | "event"
  bookingData: Record<string, any>
  totalPrice: number
  currency?: string
  onSuccess: (bookingId: string) => void
  onError?: (error: string) => void
  disabled?: boolean
}

export default function PayPalBookingButton({
  bookingType,
  bookingData,
  totalPrice,
  currency = "USD",
  onSuccess,
  onError,
  disabled = false,
}: PayPalBookingButtonProps) {
  const [processing, setProcessing] = useState(false)

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

  if (!clientId) {
    return <p className="text-red-400 text-sm">PayPal is not configured.</p>
  }

  if (disabled || totalPrice <= 0) {
    return (
      <button
        disabled
        className="w-full bg-mist-300 text-mist-500 py-3 rounded font-semibold text-sm cursor-not-allowed"
      >
        Complete the form to continue
      </button>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-mist-400 text-center">
        Your payment will be authorized but <strong>not charged</strong> until your booking is confirmed and contract is signed.
      </p>
      <PayPalScriptProvider
        options={{
          clientId,
          currency,
          intent: "authorize",
        }}
      >
        <PayPalButtons
          style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
          disabled={processing}
          forceReRender={[totalPrice, JSON.stringify(bookingData)]}
          createOrder={async () => {
            setProcessing(true)
            try {
              const res = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ totalPrice, currency, bookingRef: bookingType }),
              })

              const data = await res.json()
              if (!res.ok) throw new Error(data.error || "Failed to create order")

              return data.orderId
            } catch (err: any) {
              setProcessing(false)
              onError?.(err.message)
              throw err
            }
          }}
          onApprove={async (data) => {
            try {
              const res = await fetch("/api/paypal/authorize-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: data.orderID,
                  bookingType,
                  bookingData,
                }),
              })

              const result = await res.json()
              if (!res.ok) throw new Error(result.error || "Failed to authorize")

              onSuccess(result.bookingId)
            } catch (err: any) {
              onError?.(err.message)
            } finally {
              setProcessing(false)
            }
          }}
          onError={(err) => {
            setProcessing(false)
            onError?.(String(err))
          }}
          onCancel={() => {
            setProcessing(false)
          }}
        />
      </PayPalScriptProvider>
    </div>
  )
}
