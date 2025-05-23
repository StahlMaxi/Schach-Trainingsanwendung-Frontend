const REACT_APP_BACKEND_API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASE_URL;

export async function register(userData) {
  try {
    const response = await fetch(`${REACT_APP_BACKEND_API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = new Error("Registrierung fehlgeschlagen");
      error.status = response.status;
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

export async function login(credentials) {
  try {
    const response = await fetch(`${REACT_APP_BACKEND_API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = new Error("Login fehlgeschlagen");
      error.status = response.status;
      throw error;
    }

    const data = await response.json();

    const token = data.token;
    const expiresIn = 2 * 60 * 60 * 1000; //2 Stunden

    const record = {
      value: token,
      expiry: new Date().getTime() + expiresIn,
    };

    localStorage.setItem('token', JSON.stringify(record));
  } catch (error) {
    throw error;
  }
}
