"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Lock, CheckCircle, AlertCircle } from "lucide-react"
import toastr from "toastr"
import "toastr/build/toastr.min.css"

// Configure toastr
toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: true,
    progressBar: false,
    positionClass: "toast-top-center",
    preventDuplicates: false,
    showDuration: 300,
    hideDuration: 0,
    timeOut: 3000,
    extendedTimeOut: 1000,
}

// Validation schema
const validationSchema = Yup.object({
    newPassword: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain uppercase, lowercase, and number"
        )
        .required("New password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Confirm password is required"),
})

export default function ResetPasswordPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [isValidToken, setIsValidToken] = useState<boolean | null>(null)
    const [isSuccess, setIsSuccess] = useState(false)

    useEffect(() => {
        if (!token) {
            setIsValidToken(false)
            toastr.error("Invalid reset link", "Error")
        } else {
            setIsValidToken(true)
        }
    }, [token])

    const formik = useFormik({
        initialValues: {
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const res = await fetch("/api/password-reset/reset", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        token: token,
                        newPassword: values.newPassword,
                    }),
                })

                const data = await res.json()

                if (data.success) {
                    setIsSuccess(true)
                    toastr.success("Password reset successful!", "Success")
                    setTimeout(() => {
                        router.push("/login")
                    }, 2000)
                } else {
                    toastr.error(data.message || "Failed to reset password", "Error")
                }
            } catch (error) {
                toastr.error("Something went wrong. Please try again.", "Error")
            } finally {
                setSubmitting(false)
            }
        },
    })

    if (isValidToken === null) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        )
    }

    if (isValidToken === false) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <CardTitle className="text-xl">Invalid Link</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-gray-600 mb-4">
                            This password reset link is invalid or has expired.
                        </p>
                        <Button onClick={() => router.push("/forget-password")} className="w-full">
                            Request New Reset Link
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <CardTitle className="text-xl">Password Reset Successful!</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-gray-600 mb-4">
                            Your password has been reset successfully. Redirecting to login...
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 w-12 h-12 bg-black rounded-full flex items-center justify-center">
                        <Lock className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl">Reset Your Password</CardTitle>
                    <p className="text-gray-600 text-sm mt-2">
                        Enter your new password below
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                placeholder="Enter new password"
                                {...formik.getFieldProps("newPassword")}
                            />
                            {formik.touched.newPassword && formik.errors.newPassword ? (
                                <p className="text-sm text-red-500">{formik.errors.newPassword}</p>
                            ) : null}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm new password"
                                {...formik.getFieldProps("confirmPassword")}
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                <p className="text-sm text-red-500">{formik.errors.confirmPassword}</p>
                            ) : null}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-black hover:bg-gray-800"
                            disabled={formik.isSubmitting}
                        >
                            {formik.isSubmitting ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}