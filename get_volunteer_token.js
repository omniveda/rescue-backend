import fetch from 'node-fetch';

async function getToken() {
  const response = await fetch('https://rescue-backend-67i2.onrender.com/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'vol99@gmail.com',
      password: 'volunteerpassword' // Replace with actual password
    })
  });

  if (!response.ok) {
    console.error('Login failed:', response.statusText);
    return;
  }

  const data = await response.json();
  console.log('Token:', data.token);
}

getToken();
