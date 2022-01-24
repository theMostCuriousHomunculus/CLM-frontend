import Cookies from 'js-cookie';

export async function asyncFancyFetch({
  body,
  headers = {},
  method = 'POST',
  signal,
  url = process.env.REACT_APP_HTTP_URL
}) {
  if (
    url === process.env.REACT_APP_HTTP_URL &&
    !!Cookies.get('authentication_token')
  ) {
    headers.Authorization = `Bearer ${Cookies.get('authentication_token')}`;
  }

  if (!!body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const rawResponse = await fetch(url, {
    method,
    body: JSON.stringify(body),
    headers,
    signal
  });

  let parsedResponse;

  if (rawResponse.status === 204) {
    // 204 is successful response but no content
    parsedResponse = {};
  } else {
    parsedResponse = await rawResponse.json();
  }

  if (parsedResponse.errors) {
    throw new Error(parsedResponse.errors[0].message);
  } else {
    return parsedResponse;
  }
}

export function syncFancyFetch({
  body,
  headers = {},
  method = 'POST',
  url = process.env.REACT_APP_HTTP_URL
}) {
  if (
    url === process.env.REACT_APP_HTTP_URL &&
    !!Cookies.get('authentication_token')
  ) {
    headers.Authorization = `Bearer ${Cookies.get('authentication_token')}`;
  }

  if (!!body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  fetch(url, {
    body: JSON.stringify(body),
    headers,
    method
  });
}
