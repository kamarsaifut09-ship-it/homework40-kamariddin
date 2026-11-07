const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const usernameError = document.getElementById("username-error");
const passwordError = document.getElementById("password-error");
const formError = document.getElementById("form-error");
const loginButton = document.getElementById("login-button");

// Если пользователь уже авторизован, повторный вход не нужен.
if (getAccessToken()) {
  window.location.replace("profile.html");
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  usernameError.textContent = "";
  passwordError.textContent = "";
  formError.textContent = "";

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  let hasError = false;

  if (!username) {
    usernameError.textContent = "Введите логин.";
    hasError = true;
  }

  if (!password.trim()) {
    passwordError.textContent = "Введите пароль.";
    hasError = true;
  }

  // При пустых полях запрос к серверу не отправляется.
  if (hasError) return;

  loginButton.disabled = true;
  loginButton.textContent = "Вход...";

  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password
    });

    const { accessToken, refreshToken } = response.data;
    saveTokens(accessToken, refreshToken);
    window.location.href = "profile.html";
  } catch (error) {
    formError.textContent = "Неверный логин или пароль";
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "Войти";
  }
});
