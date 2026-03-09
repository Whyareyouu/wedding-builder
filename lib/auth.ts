export function isAdminDisabled(): boolean {
  return process.env.DISABLE_ADMIN === "true";
}

export function checkAdminAccess(): Response | null {
  if (isAdminDisabled()) {
    return Response.json({ success: false, message: "Доступ к админ панели запрещён" }, { status: 403 });
  }
  return null;
}
