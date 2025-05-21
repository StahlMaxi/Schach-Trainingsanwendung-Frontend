const REACT_APP_BACKEND_API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASE_URL;

function getToken() {
  const tokenData = localStorage.getItem('token');

  if (!tokenData) {
    const error = new Error("Kein Token vorhanden");
    error.status = 401;
    throw error;
  }

  try {
    const parsed = JSON.parse(tokenData);

    if (new Date().getTime() > parsed.expiry) {
      localStorage.removeItem('token');
      const error = new Error("Token ist abgelaufen");
      error.status = 401;
      throw error;
    }

    return parsed.value;
  } catch (e) {
    const error = new Error("Token konnte nicht gelesen werden");
    error.status = 401;
    throw error;
  }
}

export async function setVariantStatistics(variantStatistics) {
    try {
        const token = getToken();

        const response = await fetch(`${REACT_APP_BACKEND_API_BASE_URL}/statistics/variants`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(variantStatistics),
        });

        if (!response.ok) {
          const error = new Error("Erstellen der Statistik fehlgeschlagen");
          error.status = response.status;
          throw error;
        }
    } catch (error) {
        throw error;
    }   
}

export async function getOpeningStatistics() {
  try {
    const token = getToken();

    const response = await fetch(`${REACT_APP_BACKEND_API_BASE_URL}/statistics/variants`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = new Error("Statistik-Abfrage fehlgeschlagen");
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getVariantStatistics(id) {
  try {
    const token = getToken();

    const response = await fetch(`${REACT_APP_BACKEND_API_BASE_URL}/statistics/variants/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = new Error("Varianten-Statistik-Abfrage fehlgeschlagen");
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}