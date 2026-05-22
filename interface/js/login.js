document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.login-card');
  if (!form) return;

  const session = CopaBetAuth.getSession();
  if (session) {
    window.location.href = 'pages/dashboard.html';
    return;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email')?.value?.trim() || '';
    const username = email.includes('@') ? email.split('@')[0] : email || CopaBetAuth.DEFAULT_USER.username;

    CopaBetAuth.setSession({
      id: CopaBetAuth.DEFAULT_USER.id,
      username: username || CopaBetAuth.DEFAULT_USER.username,
      email: email || CopaBetAuth.DEFAULT_USER.email,
    });

    window.location.href = 'pages/dashboard.html';
  });

  const eyeBtn = document.querySelector('.eye-btn');
  const passwordInput = document.getElementById('password');
  if (eyeBtn && passwordInput) {
    eyeBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
    });
  }
});
