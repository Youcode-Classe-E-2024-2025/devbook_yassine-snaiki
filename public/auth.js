// auth.js
const apiUrl = 'http://localhost:4000/api/auth';

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutBtn = document.getElementById('logoutBtn');

const saveToken = (token) => localStorage.setItem('token', token);

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    const res = await fetch(`${apiUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    window.location.href = '/public/login.html';
    if (data.token) {
      window.location.href = '/public/index.html';
    }
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const res = await fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (data.token) {
      saveToken(data.token);
      localStorage.setItem('isAdmin',data.isAdmin);
      localStorage.setItem('id',data.id);

      window.location.href = '/public/index.html';
    } else {
      alert(data.error);
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    await fetch(`${apiUrl}/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.removeItem('token');
    window.location.href = '/public/login.html';
  });
}
