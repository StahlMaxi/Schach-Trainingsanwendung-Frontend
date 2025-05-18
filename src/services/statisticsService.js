const REACT_APP_BACKEND_API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASE_URL;

export async function setVariantStatistics(variantStatistics) {
    try {
        const tokenData = localStorage.getItem('token');

        const parsedTokenData = JSON.parse(tokenData);
        const token = parsedTokenData.value;

        const response = await fetch(`${REACT_APP_BACKEND_API_BASE_URL}/statistics/variants`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(variantStatistics),
        });

        if (!response.ok) {
            throw new Error('Keine Erlaubnis für diese API');
        }
    } catch (error) {
        throw error;
    }   
}

export async function getOpeningStatistics() {
  try {
    const tokenData = localStorage.getItem('token');

    const parsedTokenData = JSON.parse(tokenData);
    const token = parsedTokenData.value;

    const response = await fetch(`${REACT_APP_BACKEND_API_BASE_URL}/statistics/variants`, {
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

export async function getVariantStatistics(id) {
  try {
    const tokenData = localStorage.getItem('token');

    const parsedTokenData = JSON.parse(tokenData);
    const token = parsedTokenData.value;

    const response = await fetch(`${REACT_APP_BACKEND_API_BASE_URL}/statistics/variants/${id}`, {
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