const REACT_APP_BACKEND_API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASE_URL;

export async function getOpenings() {
  try {
    const tokenData = localStorage.getItem('token');

    const parsedTokenData = JSON.parse(tokenData);
    const token = parsedTokenData.value;

    const response = await fetch(`${REACT_APP_BACKEND_API_BASE_URL}/openings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Keine Erlaubnis für diese API');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getVariants(id) {
  try {
    const tokenData = localStorage.getItem('token');

    const parsedTokenData = JSON.parse(tokenData);
    const token = parsedTokenData.value;

    const response = await fetch(`${REACT_APP_BACKEND_API_BASE_URL}/openings/${id}/variants`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Keine Erlaubnis für diese API');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getNextOpeningMoves({ id, played }) {
  try {
    const tokenData = localStorage.getItem('token');
    const parsedTokenData = JSON.parse(tokenData);
    const token = parsedTokenData.value;

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
      throw new Error('Keine Erlaubnis für diese API');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getNextVariantMove({ id, played }) {
  try {
    const tokenData = localStorage.getItem('token');
    const parsedTokenData = JSON.parse(tokenData);
    const token = parsedTokenData.value;

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
      throw new Error('Keine Erlaubnis für diese API');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}