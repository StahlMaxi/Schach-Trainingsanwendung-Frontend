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

export async function getOpenings() {
  try {
    const token = getToken();

    const response = await fetch(`${REACT_APP_BACKEND_API_BASE_URL}/openings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = new Error("Eröffnungsabfrage fehlgeschlagen");
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getVariants(id) {
  try {
    const token = getToken();

    const response = await fetch(`${REACT_APP_BACKEND_API_BASE_URL}/openings/${id}/variants`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = new Error("Variantenabfrage fehlgeschlagen");
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getNextOpeningMoves({ id, played }) {
  try {
    const token = getToken();

    const playedParam = played ? `played=${encodeURIComponent(played)}` : '';
    const url = `${REACT_APP_BACKEND_API_BASE_URL}/openings/${id}/variants/next-moves${playedParam ? `?${playedParam}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = new Error("Next-Move-Abfrage fehlgeschlagen");
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getNextVariantMove({ id, played }) {
  try {
    const token = getToken();

    const playedParam = played ? `played=${encodeURIComponent(played)}` : '';
    const url = `${REACT_APP_BACKEND_API_BASE_URL}/openings/${id}/next-move${playedParam ? `?${playedParam}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = new Error("Next-Moves-Abfrage fehlgeschlagen");
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}