// Shared Modal Components for Nike Dashboard
import React from "react"
import { X } from "lucide-react"

/* ================= BASE MODAL COMPONENT ================= */
export const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl"
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal Container */}
      <div
        className={`relative w-full ${sizeClasses[size]} animate-slideUp`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Content */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl border border-gray-800 shadow-2xl">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-600/10 to-pink-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-600/10 to-blue-600/10 rounded-full blur-3xl" />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-gray-800">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-gray-800 hover:bg-red-600 text-white transition-all hover:scale-110"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="relative z-10 px-8 py-6">
            {children}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      ` }} />
    </div>
  )
}

/* ================= FORM INPUT COMPONENTS ================= */
export const FormInput = ({ label, type = "text", ...props }) => (
  <div className="space-y-2">
    <label className="block text-sm font-black text-gray-400 uppercase tracking-wider">
      {label}
    </label>
    <input
      type={type}
      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
      {...props}
    />
  </div>
)

export const FormTextarea = ({ label, ...props }) => (
  <div className="space-y-2">
    <label className="block text-sm font-black text-gray-400 uppercase tracking-wider">
      {label}
    </label>
    <textarea
      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
      rows={4}
      {...props}
    />
  </div>
)

export const FormSelect = ({ label, options, ...props }) => (
  <div className="space-y-2">
    <label className="block text-sm font-black text-gray-400 uppercase tracking-wider">
      {label}
    </label>
    <select
      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
)

export const FormFileUpload = ({ label, onChange, accept = "image/*" }) => (
  <div className="space-y-2">
    <label className="block text-sm font-black text-gray-400 uppercase tracking-wider">
      {label}
    </label>
    <div className="relative">
      <input
        type="file"
        accept={accept}
        onChange={onChange}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="flex items-center justify-center w-full px-4 py-8 bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl text-gray-400 hover:border-orange-500 hover:text-orange-500 cursor-pointer transition-all"
      >
        <div className="text-center">
          <div className="text-4xl mb-2">📁</div>
          <div className="text-sm font-bold">Click to upload or drag and drop</div>
          <div className="text-xs mt-1">PNG, JPG, GIF up to 10MB</div>
        </div>
      </label>
    </div>
  </div>
)

/* ================= BUTTON COMPONENTS ================= */
export const PrimaryButton = ({ children, onClick, type = "button", disabled = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className="px-8 py-3 bg-white text-black font-black text-sm uppercase tracking-wider rounded-full hover:bg-gray-200 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
  >
    {children}
  </button>
)

export const SecondaryButton = ({ children, onClick, type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    className="px-8 py-3 bg-gray-800 text-white font-black text-sm uppercase tracking-wider rounded-full hover:bg-gray-700 transition-all hover:scale-105"
  >
    {children}
  </button>
)

export const DangerButton = ({ children, onClick, type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    className="px-8 py-3 bg-red-600 text-white font-black text-sm uppercase tracking-wider rounded-full hover:bg-red-700 transition-all hover:scale-105"
  >
    {children}
  </button>
)

/* ================= CONFIRMATION DIALOG ================= */
export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, type = "danger" }) => {
  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-6">
        <p className="text-gray-300 text-base leading-relaxed">
          {message}
        </p>

        <div className="flex gap-3 justify-end">
          <SecondaryButton onClick={onClose}>
            Cancel
          </SecondaryButton>
          {type === "danger" ? (
            <DangerButton onClick={onConfirm}>
              Confirm
            </DangerButton>
          ) : (
            <PrimaryButton onClick={onConfirm}>
              Confirm
            </PrimaryButton>
          )}
        </div>
      </div>
    </Modal>
  )
}