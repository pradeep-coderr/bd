export function adminEmail(): string | null {
  const email = process.env.ADMIN_EMAIL;
  return email ? email.toLowerCase() : null;
}

export function girlfriendEmail(): string | null {
  const email = process.env.GF_EMAIL;
  return email ? email.toLowerCase() : null;
}

export function isAdminEmail(email: string | undefined | null): boolean {
  const admin = adminEmail();
  if (!admin || !email) return false;
  return email.toLowerCase() === admin;
}

export function isAllowedEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const lower = email.toLowerCase();
  if (isAdminEmail(lower)) return true;
  const gf = girlfriendEmail();
  return !!gf && lower === gf;
}
