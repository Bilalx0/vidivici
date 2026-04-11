"use client"

import { useState, useEffect, use } from "react"
import { Upload, CheckCircle, AlertCircle, FileText } from "lucide-react"

export default function ContractUploadPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = use(searchParams)

  const [booking, setBooking] = useState<{
    bookingType: string
    bookingNumber: string
    itemName: string
    contractStatus: string
    alreadyUploaded: boolean
  } | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setError("Invalid link — no token provided.")
      setLoading(false)
      return
    }
    fetch(`/api/contract/upload?token=${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error)
        else setBooking(data)
      })
      .catch(() => setError("Failed to load booking details."))
      .finally(() => setLoading(false))
  }, [token])

  const handleUpload = async () => {
    if (!file || !token) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append("token", token)
      form.append("file", file)
      const res = await fetch("/api/contract/upload", { method: "POST", body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Upload failed")
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-mist-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-mist-900" />
      </div>
    )
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen bg-mist-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h1 className="text-xl font-bold text-mist-900 mb-2">Invalid Link</h1>
          <p className="text-mist-500">{error}</p>
        </div>
      </div>
    )
  }

  if (success || booking?.alreadyUploaded) {
    return (
      <div className="min-h-screen bg-mist-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center">
          <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
          <h1 className="text-xl font-bold text-mist-900 mb-2">
            {booking?.alreadyUploaded && !success ? "Already Submitted" : "Contract Submitted"}
          </h1>
          <p className="text-mist-500">
            {booking?.alreadyUploaded && !success
              ? "We have already received your signed contract for this booking."
              : "Thank you! We have received your signed contract. Our team will review it and confirm your booking shortly."}
          </p>
          {booking && (
            <p className="mt-4 text-sm text-mist-400">Booking Reference: <strong>{booking.bookingNumber}</strong></p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-mist-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-mist-100 rounded-full mb-3">
            <FileText className="text-mist-700" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-mist-900">Upload Signed Contract</h1>
          <p className="text-mist-500 text-sm mt-1">Vidi Vici Hospitality Group</p>
        </div>

        {/* Booking Info */}
        {booking && (
          <div className="bg-mist-50 rounded-xl p-4 mb-6 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-mist-500">Booking #</span>
              <span className="font-semibold text-mist-900">{booking.bookingNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-mist-500">Item</span>
              <span className="font-semibold text-mist-900">{booking.itemName}</span>
            </div>
          </div>
        )}

        <p className="text-mist-600 text-sm mb-4">
          Please upload your signed договор. Accepted formats: PDF, JPG, PNG (max 10MB).
        </p>
        <p className="text-mist-500 text-xs mb-5">
          After uploading, our team will review the document and finalize your booking. You will receive a confirmation email.
        </p>

        {/* File Input */}
        <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors ${file ? "border-mist-400 bg-mist-50" : "border-mist-200 hover:border-mist-400"}`}>
          <Upload className="text-mist-400 mb-2" size={32} />
          {file ? (
            <span className="text-sm font-medium text-mist-900 text-center break-all">{file.name}</span>
          ) : (
            <span className="text-sm text-mist-500">Click to select file or drag and drop</span>
          )}
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => {
              const selected = e.target.files?.[0]
              if (selected) setFile(selected)
            }}
          />
        </label>

        {error && (
          <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="mt-5 w-full bg-mist-900 text-white font-semibold py-3 rounded-xl hover:bg-mist-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? "Uploading..." : "Submit Signed Contract"}
        </button>
      </div>
    </div>
  )
}
