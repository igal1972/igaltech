"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ADMIN_COOKIE, createAdminSessionValue, verifyAdminPassword } from "@/lib/admin-auth"

export type LoginState = { error?: string }

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "")

  if (!verifyAdminPassword(password)) {
    await new Promise((resolve) => setTimeout(resolve, 800))
    return { error: "הסיסמה שגויה" }
  }

  ;(await cookies()).set(ADMIN_COOKIE, createAdminSessionValue(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/admin",
    maxAge: 60 * 60 * 24 * 30,
  })

  redirect("/admin")
}

export async function logout() {
  ;(await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" })
  redirect("/admin")
}
