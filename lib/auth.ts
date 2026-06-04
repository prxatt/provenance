export function isAdmin(req:Request){const token=req.headers.get('x-admin-token')||'';return Boolean(process.env.ADMIN_TOKEN)&&token===process.env.ADMIN_TOKEN}
