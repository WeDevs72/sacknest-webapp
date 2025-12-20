import { Suspense } from 'react'
import PaymentSuccessClient from './PaymentSuccessClient'

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
      <PaymentSuccessClient />
    </Suspense>
  )
}
