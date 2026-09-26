"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUser, clearAuth } from "@/lib/auth"

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const userStr = getUser()
    if (!userStr) {
      clearAuth()
      setChecked(true)
      router.push("/login")
      return
    }

    try {
      const user = JSON.parse(userStr)
      if (user.role !== "admin") {
        clearAuth()
        setChecked(true)
        router.push("/nike/products")
        return
      }
    } catch {
      clearAuth()
      setChecked(true)
      router.push("/login")
      return
    }

    setChecked(true)
  }, [router])

  if (!checked) {
    return null
  }

  return <>{children}</>
}
