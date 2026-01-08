"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Lock, Shield, AlertTriangle, Camera } from "lucide-react"

const AdminSettingsPage = () => {
  const [profile, setProfile] = useState({
    name: "Yogesh Thapa",
    email: "admin@nikeclone.com",
    profilePic:
      "https://wallpapers.com/images/hd/nike-logo-diuxayp2mn6ubbxd.jpg",
  })

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-black">
      {/* HEADER SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black px-6 pt-12 pb-8">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10">
          <div className="inline-block mb-3 px-4 py-1 bg-white text-black text-xs font-black tracking-widest uppercase rounded-full">
            Account Settings
          </div>
          
          <div>
            <h1 className="text-6xl md:text-7xl font-black text-white leading-none tracking-tighter mb-3">
              SETTINGS
            </h1>
            <p className="text-xl text-gray-400 font-medium">
              Manage your profile, security, and preferences
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT - SETTINGS FORMS */}
          <div className="lg:col-span-2 space-y-6">
            {/* PROFILE CARD */}
            <div 
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 p-6"
              style={{ animation: 'slideUp 0.6s ease-out 0s backwards' }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-800 border-2 border-orange-500">
                      <img
                        src={profile.profilePic}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button className="absolute -bottom-1 -right-1 p-1.5 bg-orange-500 rounded-full hover:bg-orange-600 transition-colors">
                      <Camera size={12} className="text-white" />
                    </button>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User size={18} className="text-orange-500" />
                      <h2 className="text-xl font-black text-white uppercase tracking-tight">
                        Profile Information
                      </h2>
                    </div>
                    <p className="text-gray-400 text-sm font-medium">
                      Update your admin account details
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2 block">
                    Name
                  </Label>
                  <Input
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className="bg-gray-800 border-gray-700 text-white font-medium focus:border-orange-500 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <Label className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2 block">
                    Email
                  </Label>
                  <Input
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="bg-gray-800 border-gray-700 text-white font-medium focus:border-orange-500 focus:ring-orange-500/20"
                  />
                </div>

                <div className="md:col-span-2">
                  <Button className="w-full mt-4 bg-white text-black hover:bg-green-300 font-black text-sm uppercase tracking-wider py-6 rounded-xl">
                    Save Profile Changes
                  </Button>
                </div>
              </div>
            </div>

            {/* PASSWORD CARD */}
            <div 
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 p-6"
              style={{ animation: 'slideUp 0.6s ease-out 0.1s backwards' }}
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
                  <Label className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2 block">
                    Current Password
                  </Label>
                  <Input 
                    type="password" 
                    className="bg-gray-800 border-gray-700 text-white font-medium focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <Label className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2 block">
                    New Password
                  </Label>
                  <Input 
                    type="password" 
                    className="bg-gray-800 border-gray-700 text-white font-medium focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <Label className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2 block">
                    Confirm Password
                  </Label>
                  <Input 
                    type="password" 
                    className="bg-gray-800 border-gray-700 text-white font-medium focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                <div className="md:col-span-3">
                  <Button className="w-full mt-4 bg-white text-black hover:bg-blue-300 font-black text-sm uppercase tracking-wider py-6 rounded-xl">
                    Update Password
                  </Button>
                </div>
              </div>
            </div>

            {/* DANGER ZONE */}
            <div 
              className="relative overflow-hidden rounded-2xl border border-red-500/50 bg-gradient-to-br from-red-950/50 to-black p-6"
              style={{ animation: 'slideUp 0.6s ease-out 0.2s backwards' }}
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

                <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-wider py-6 rounded-xl border border-red-500">
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
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 p-6"
              style={{ animation: 'slideUp 0.6s ease-out 0.3s backwards' }}
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
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      ` }} />
    </div>
  )
}

export default AdminSettingsPage