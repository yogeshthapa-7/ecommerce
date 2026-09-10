"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUser, clearAuth } from "@/lib/auth"

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const userStr = getUser()
    if (!userStr) {
      clearAuth()
      setChecking(false)
      router.push("/login")
      return
    }

    try {
      const user = JSON.parse(userStr)
      if (user.role !== "admin") {
        clearAuth()
        setChecking(false)
        router.push("/nike/products")
        return
      }
    } catch {
      clearAuth()
      setChecking(false)
      router.push("/login")
      return
    }

    setChecking(false)
  }, [router])

  if (checking) {
    return null
  }

  return <>{children}</>
}
