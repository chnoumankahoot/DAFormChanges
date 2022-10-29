import { toast } from 'react-toastify';
import { API_KEY, SCRIPT_PROD_URL } from './constants';

export const makeApiRequests = async ({ requestType, requestBody }) => {
  try {
    const response = await (await fetch(SCRIPT_PROD_URL, {
      method: 'POST',
      body: JSON.stringify({
        email: localStorage.getItem('user-email'),
        loginCode: localStorage.getItem('user-code'),
        clientId: API_KEY,
        requestType,
        ...requestBody
      }),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      }
    })).json();

    if (response['customToast']) {
      toast.error(response['customToast']);
    }

    if (response['success']) {
      return { response };
    } else {
      return { error: response['reason'] || 'Oops something went wrong!' };
    }
  } catch (e) {
    console.log(e);
    return { error: 'Oops something went wrong!' };
  }
};
