const API_URL = "https://dummyjson.com";

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

function saveTokens(accessToken, refreshToken) {
  if (accessToken) localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
}

function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

function logout() {
  clearTokens();
  window.location.href = "login.html";
}

// Повторяем запрос профиля после успешного обновления access-токена.
async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await axios.post(`${API_URL}/auth/refresh`, {
      refreshToken,
      expiresInMins: 30
    });

    const data = response.data;
    if (!data.accessToken) return false;

    saveTokens(data.accessToken, data.refreshToken || refreshToken);
    return true;
  } catch (error) {
    return false;
  }
}
