const profileContent = document.getElementById("profile-content");
const logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("click", logout);

function showProfile(user) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  profileContent.innerHTML = `
    <div class="user-photo-wrap">
      <img class="user-photo" src="${user.image}" alt="Фото профиля">
      <span class="online-indicator"></span>
    </div>
    <div class="user-info">
      <p class="eyebrow">ПОЛЬЗОВАТЕЛЬ</p>
      <h2>${fullName || "Пользователь"}</h2>
      <p class="user-email">${user.email || "Email не указан"}</p>
      <div class="details-grid">
        <div class="detail-item"><span>Возраст</span><strong>${user.age ?? "—"}</strong></div>
        <div class="detail-item"><span>Город</span><strong>${user.address?.city || "—"}</strong></div>
        <div class="detail-item"><span>Логин</span><strong>${user.username || "—"}</strong></div>
      </div>
    </div>
  `;
}

async function loadProfile() {
  const token = getAccessToken();

  if (!token) {
    window.location.replace("login.html");
    return;
  }

  profileContent.innerHTML = '<div class="loading">Загрузка...</div>';

  try {
    // Первый запрос профиля с access-токеном.
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: "Bearer " + token }
    });

    showProfile(response.data);
  } catch (error) {
    if (error.response?.status === 401) {
      // Сначала пробуем обновить токен, затем повторяем запрос профиля.
      const refreshed = await refreshAccessToken();

      if (refreshed) {
        try {
          const retryResponse = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: "Bearer " + getAccessToken() }
          });
          showProfile(retryResponse.data);
          return;
        } catch (retryError) {
          // Если повторный запрос тоже не прошёл — завершаем сессию.
        }
      }

      logout();
      return;
    }

    profileContent.innerHTML = '<p class="form-error">Не удалось загрузить профиль. Проверьте подключение к интернету и обновите страницу.</p>';
  }
}

loadProfile();
