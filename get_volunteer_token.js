import fetch from 'node-fetch';

async function getToken() {
  const response = await fetch('http://localhost:5000/api/auth/login', {
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
