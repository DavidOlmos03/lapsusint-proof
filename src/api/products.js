const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

export async function fetchProducts() {
  const res = await fetch(`${API_URL}/licenses`);
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json();
}

export async function createProduct(token, data) {
  const formData = new FormData();
  formData.append("product_name", data.name);
  formData.append("description", data.description || "");
  formData.append("price", data.price);
  formData.append("price_one_week", data.price_one_week);
  formData.append("price_one_month", data.price_one_month);
  formData.append("price_three_months", data.price_three_months);
  formData.append("price_lifetime", data.price_lifetime);
  formData.append("supported_platforms", data.platform || "");
  formData.append("supported_launchers", data.launcher || "");
  formData.append("recommendations", data.requirements || "");
  formData.append("product_version", data.version || "");
  formData.append("has_spoofer", data.has_spoofer || false);
  formData.append("language", data.language || "English, Spanish");
  formData.append("stock_quantity", data.stock_quantity || 1);
  formData.append("is_active", true);
  formData.append("category", data.category || "Gaming");
  if (data.image) formData.append("image", data.image);

  const res = await fetch(`${API_URL}/licenses`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error("Error al crear producto");
  return res.json();
}

export async function updateProduct(token, id, data) {
  const formData = new FormData();
  formData.append("product_name", data.name);
  formData.append("description", data.description || "");
  formData.append("price", data.price);
  formData.append("price_one_week", data.price_one_week);
  formData.append("price_one_month", data.price_one_month);
  formData.append("price_three_months", data.price_three_months);
  formData.append("price_lifetime", data.price_lifetime);
  formData.append("supported_platforms", data.platform || "");
  formData.append("supported_launchers", data.launcher || "");
  formData.append("recommendations", data.requirements || "");
  formData.append("product_version", data.version || "");
  formData.append("has_spoofer", data.has_spoofer || false);
  formData.append("language", data.language || "English, Spanish");
  formData.append("stock_quantity", data.stock_quantity || 1);
  formData.append("is_active", true);
  formData.append("category", data.category || "Gaming");
  if (data.image) formData.append("image", data.image);

  const res = await fetch(`${API_URL}/licenses/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error("Error al editar producto");
  return res.json();
}

export async function deleteProduct(token, id) {
  const res = await fetch(`${API_URL}/licenses/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al eliminar producto");
  return res.json();
}

// --- NUEVAS FUNCIONES PARA EL SISTEMA DE LICENCIAS ---

export async function createOrder(token, orderData) {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error("Error al crear orden");
  return res.json();
}

export async function completePurchase(token, orderId) {
  const res = await fetch(`${API_URL}/orders/${orderId}/complete`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al completar compra");
  return res.json();
}

export async function validateLicense(licenseKey) {
  const res = await fetch(`${API_URL}/validate-license`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ license_key: licenseKey }),
  });
  if (!res.ok) throw new Error("Licencia inválida");
  return res.json();
}

export async function getUserLicenses(token) {
  const res = await fetch(`${API_URL}/user/licenses`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener licencias");
  return res.json();
}

export async function getUserOrders(token) {
  const res = await fetch(`${API_URL}/user/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener órdenes");
  return res.json();
}

export async function addProductWithKey(token, licenseKey) {
  const res = await fetch(`${API_URL}/add-product-with-key`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ license_key: licenseKey }),
  });
  if (!res.ok) throw new Error("Error al agregar producto");
  return res.json();
}