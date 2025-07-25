const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

export async function login(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username, password }),
  });
  if (!res.ok) throw new Error("Credenciales incorrectas");
  return res.json();
}

export async function register({ username, password, email, role }) {
  const body = { username, password, email };
  if (role) body.role = role;
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Error al registrar usuario");
  return res.json();
}

export async function deleteUserLicenseUser(token, licenseId) {
  const res = await fetch(`${API_URL}/user/licenses/${licenseId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al eliminar licencia");
  return res.json();
}

export async function getAllLicenses(token) {
  const res = await fetch(`${API_URL}/licenses/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener licencias");
  return res.json();
}

export async function adminDeleteLicense(token, licenseId) {
  const res = await fetch(`${API_URL}/admin/licenses/${licenseId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al eliminar licencia");
  return res.json();
}

export async function getAllUsers(token) {
  const res = await fetch(`${API_URL}/users/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return res.json();
}

export async function updateUserRole(token, userId, newRole) {
  const res = await fetch(`${API_URL}/users/${userId}`, {
    method: "PUT",
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ role: newRole })
  });
  if (!res.ok) throw new Error("Error al actualizar rol");
  return res.json();
}

export async function getSystemStatistics(token) {
  const res = await fetch(`${API_URL}/dev/statistics`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener estadísticas");
  return res.json();
}

export async function getUserDetails(token, userId) {
  const res = await fetch(`${API_URL}/dev/users/${userId}/details`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener detalles del usuario");
  return res.json();
}

export async function deleteUserLicense(token, licenseId) {
  const res = await fetch(`${API_URL}/dev/licenses/${licenseId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al eliminar licencia");
  return res.json();
}

export async function deleteUser(token, userId) {
  const res = await fetch(`${API_URL}/users/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al eliminar usuario");
  return res.json();
}

export async function getUserLicenses(token) {
  const res = await fetch(`${API_URL}/user/licenses`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Error al obtener licencias");
  return res.json();
}