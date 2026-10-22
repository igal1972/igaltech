import { createHash, createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"

export const ADMIN_COOKIE = "igaltech_admin"

function sessionToken(password: string) {
  return createHmac("sha256", password).update("igaltech-admin-session-v1").digest("hex")
}

function safeEqual(a: string, b: string) {
  const hashA = createHash("sha256").update(a).digest()
  const hashB = createHash("sha256").update(b).digest()
  return timingSafeEqual(hashA, hashB)
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD)
}

export function verifyAdminPassword(input: string) {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return false
  return safeEqual(input, password)
}

export function createAdminSessionValue() {
  return sessionToken(process.env.ADMIN_PASSWORD as string)
}

export async function isAdminAuthenticated() {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return false
  const value = (await cookies()).get(ADMIN_COOKIE)?.value
  if (!value) return false
  return safeEqual(value, sessionToken(password))
}
