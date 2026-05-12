"use client"
import React, { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Lock, Shield, AlertTriangle, Camera, CheckCircle, XCircle } from "lucide-react"
import { AdminConfirmDialog, PageBody, PageHeader, adminPanel, fieldClass, labelClass } from "@/components/admin/AdminSurface"
const AdminSettingsPage = () => {
  const router = useRouter()
  // --- STATE MANAGEMENT ---
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Notification State
  const [notification, setNotification] = useState<{ message: string, type: string } | null>(null)

  // Profile State
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profilePic: "https://wallpapers.com/images/hd/nike-logo-diuxayp2mn6ubbxd.jpg",
  })

  // Password State
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  })

  // --- FETCH USER DATA ---
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
        const data = await res.json()

        if (res.ok) {
          setProfile({
            name: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
            email: data.email,
            profilePic: data.profilePic || "https://wallpapers.com/images/hd/nike-logo-diuxayp2mn6ubbxd.jpg"
          })
        }
      } catch (err) {
        console.error("Error fetching user:", err)
      }
    }
    fetchUser()
  }, [])

  // --- HANDLERS ---

  // Helper to show notifications
  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // Handle Text Inputs
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value })
  }

  // 1. Image Upload Logic
  const triggerImageUpload = () => fileInputRef.current?.click()

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      showNotification("Please select a valid image file.", "error")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification("Profile picture must be 5MB or smaller.", "error")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const previousProfilePic = profile.profilePic
    const previewUrl = URL.createObjectURL(file)
    setProfile(prev => ({ ...prev, profilePic: previewUrl }))
    setIsUploadingImage(true)

    try {
      const image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = () => reject(new Error("Failed to read image"))
        reader.readAsDataURL(file)
      })

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile-picture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          image,
          fileName: file.name
        })
      })

      const data = await res.json()

      if (res.ok && data.imageUrl) {
        setProfile(prev => ({ ...prev, profilePic: data.imageUrl }))
        showNotification("Profile picture uploaded. Click Save Profile Changes to store it.")
      } else {
        setProfile(prev => ({ ...prev, profilePic: previousProfilePic }))
        showNotification(data.message || "Failed to upload profile picture.", "error")
      }
    } catch (err) {
      setProfile(prev => ({ ...prev, profilePic: previousProfilePic }))
      showNotification("Failed to upload profile picture.", "error")
    } finally {
      URL.revokeObjectURL(previewUrl)
      setIsUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  // 2. Save Profile Logic
  const handleSaveProfile = async () => {
    if (!profile.name || !profile.email) {
      showNotification("Name and Email are required.", "error")
      return
    }

    setIsLoading(true)
    const token = localStorage.getItem("token")

    // Split name into firstName and lastName
    const nameParts = profile.name.trim().split(" ")
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(" ")

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email: profile.email,
          profilePic: profile.profilePic
        })
      })

      const data = await res.json()
      setIsLoading(false)

      if (res.ok) {
        showNotification("Profile details saved successfully!")
        // Update local storage user data if exists
        const user = JSON.parse(localStorage.getItem("user") || "{}")
        localStorage.setItem("user", JSON.stringify({ ...user, ...data.user }))
      } else {
        showNotification(data.message || "Failed to save profile.", "error")
      }
    } catch (err) {
      setIsLoading(false)
      showNotification("Server error. Please try again.", "error")
    }
  }

  // 3. Update Password Logic
  const handleUpdatePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      showNotification("Please fill in all password fields.", "error")
      return
    }

    if (passwords.new !== passwords.confirm) {
      showNotification("New passwords do not match.", "error")
      return
    }

    if (passwords.new.length < 6) {
      showNotification("Password must be at least 6 characters.", "error")
      return
    }

    setIsLoading(true)
    const token = localStorage.getItem("token")

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new
        })
      })

      const data = await res.json()
      setIsLoading(false)

      if (res.ok) {
        setPasswords({ current: "", new: "", confirm: "" })
        showNotification("Security password updated successfully!")
      } else {
        showNotification(data.message || "Failed to update password.", "error")
      }
    } catch (err) {
      setIsLoading(false)
      showNotification("Server error. Please try again.", "error")
    }
  }

  // 4. Delete Account Logic
  const handleDeleteAccount = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsDeleteDialogOpen(false)
      showNotification("Account deletion flow confirmed. Connect the real API before enabling the final removal step.")
      // router.push("/login")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-[#080808] relative">

      {/* CUSTOM NOTIFICATION TOAST */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${notification.type === "success"
            ? "bg-green-900/90 border-green-500 text-white"
            : "bg-red-900/90 border-red-500 text-white"
            }`}>
            {notification.type === "success" ? <CheckCircle size={20} /> : <XCircle size={20} />}
            <span className="font-bold text-sm">{notification.message}</span>
          </div>
        </div>
      )}

      <PageHeader
        title="Settings"
        label="Account Settings"
        description="Manage profile, security, and admin preferences with a cleaner control surface."
      />

      {/* MAIN CONTENT */}
      <PageBody>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT - SETTINGS FORMS */}
          <div className="lg:col-span-2 space-y-6">

            {/* PROFILE CARD */}
            <div
              className={`${adminPanel} p-6`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative group cursor-pointer" onClick={triggerImageUpload}>
                    <div className="h-16 w-16 rounded-2xl overflow-hidden bg-gray-800 border border-white/15">
                      <img
                        src={profile.profilePic}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {/* Hidden File Input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <button
                      type="button"
                      className="absolute -bottom-1 -right-1 z-10 rounded-full bg-white p-1.5 text-black transition-colors hover:bg-lime-300"
                    >
                      <Camera size={12} className="text-black" />
                    </button>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera size={20} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User size={18} className="text-lime-300" />
                      <h2 className="text-xl font-black text-white uppercase tracking-tight">
                        Profile Information
                      </h2>
                    </div>
                    <p className="text-gray-400 text-sm font-medium">
                      {isUploadingImage ? "Uploading profile picture..." : "Update your admin account details"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className={labelClass}>
                    Name
                  </Label>
                  <Input
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className={fieldClass}
                  />
                </div>

                <div>
                  <Label className={labelClass}>
                    Email
                  </Label>
                  <Input
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className={fieldClass}
                  />
                </div>

                <div className="md:col-span-2">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isLoading || isUploadingImage}
                    className="w-full mt-4 bg-white text-black hover:bg-gray-200 font-black text-sm uppercase tracking-wider py-6 rounded-xl transition-all disabled:opacity-50"
                  >
                    {isUploadingImage ? "Uploading image..." : isLoading ? "Saving..." : "Save Profile Changes"}
                  </Button>
                </div>
              </div>
            </div>

            {/* PASSWORD CARD */}
            <div
              className={`${adminPanel} p-6`}
            >
              <div className="flex items-center gap-2 mb-6">
                <Lock size={18} className="text-blue-500" />
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">
                    Security
                  </h2>
                  <p className="text-gray-400 text-sm font-medium">
                    Change your account password
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className={labelClass}>
                    Current Password
                  </Label>
                  <Input
                    type="password"
                    name="current"
                    value={passwords.current}
                    onChange={handlePasswordChange}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <Label className={labelClass}>
                    New Password
                  </Label>
                  <Input
                    type="password"
                    name="new"
                    value={passwords.new}
                    onChange={handlePasswordChange}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <Label className={labelClass}>
                    Confirm Password
                  </Label>
                  <Input
                    type="password"
                    name="confirm"
                    value={passwords.confirm}
                    onChange={handlePasswordChange}
                    className={fieldClass}
                  />
                </div>

                <div className="md:col-span-3">
                  <Button
                    onClick={handleUpdatePassword}
                    disabled={isLoading}
                    className="w-full mt-4 bg-white text-black hover:bg-gray-200 font-black text-sm uppercase tracking-wider py-6 rounded-xl transition-all disabled:opacity-50"
                  >
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </div>
            </div>

            {/* DANGER ZONE */}
            <div
              className="relative overflow-hidden rounded-2xl border border-red-500/50 bg-gradient-to-br from-red-950/50 to-black p-6"
            >
              <div className="absolute inset-0 bg-red-500/5" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={20} className="text-red-500" />
                  <h2 className="text-xl font-black text-red-500 uppercase tracking-tight">
                    Danger Zone
                  </h2>
                </div>
                <p className="text-red-400 text-sm font-medium mb-4">
                  This action is permanent and cannot be undone. All data will be permanently deleted.
                </p>

                <Button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-wider py-6 rounded-xl border border-red-500 transition-colors"
                >
                  Delete Admin Account
                </Button>
              </div>
            </div>
          </div>

          {/* RIGHT - NIKE VISUAL PANELS */}
          <div className="space-y-6">
            {/* Nike CTA Panel */}
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
                alt="Nike Shoes"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

              <div className="relative z-10 p-6 min-h-[300px] flex flex-col justify-end">
                <h2 className="text-4xl font-black text-white leading-tight tracking-tighter mb-2">
                  JUST<br />DO IT.
                </h2>
                <p className="text-gray-300 text-sm font-medium">
                  Secure your admin account and keep your Nike dashboard running smoothly.
                </p>
              </div>
            </div>

            {/* Quick Stats Panel */}
            <div
              className={`${adminPanel} p-6`}
            >
              <div className="flex items-center gap-2 mb-4">
                <Shield size={20} className="text-green-500" />
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  Security Status
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <span className="text-green-400 text-sm font-bold">Two-Factor Auth</span>
                  <span className="px-2 py-1 bg-green-500 text-white text-xs font-black rounded-full">
                    ACTIVE
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700 rounded-xl">
                  <span className="text-gray-400 text-sm font-bold">Last Login</span>
                  <span className="text-white text-xs font-black">
                    Today, 2:30 PM
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700 rounded-xl">
                  <span className="text-gray-400 text-sm font-bold">Active Sessions</span>
                  <span className="text-white text-xs font-black">
                    2 Devices
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageBody>

      <AdminConfirmDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Admin Account"
        message="This will remove your admin access and is meant to be permanent. The live destructive API is still commented out, but the browser confirm has been replaced with this controlled confirmation flow."
        confirmLabel={isLoading ? "Deleting..." : "Delete Account"}
      />
    </div>
  )
}

export default AdminSettingsPage
