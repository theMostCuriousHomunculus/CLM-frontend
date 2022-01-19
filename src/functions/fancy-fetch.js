import Cookies from 'js-cookie';

const activeRequests = [];

export async function asyncFancyFetch({
  args,
  failureCallback = async () => {
    // don't do anything by default
  },
  headers = {},
  method = 'POST',
  operation, // undefined, 'query' or 'mutation'
  query,
  rawBody,
  resolver,
  successCallback = async () => {
    // don't do anything by default
  },
  url = process.env.REACT_APP_HTTP_URL
}) {
  if (
    url === process.env.REACT_APP_HTTP_URL &&
    !!Cookies.get('authentication_token')
  ) {
    headers.Authorization = `Bearer ${Cookies.get('authentication_token')}`;
  }

  if ((!!rawBody || !!resolver) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  let body;

  if (!!resolver) {
    body = JSON.stringify({
      query: `
        ${operation} {
          ${resolver}${args ? `(${args})` : ''}${
        query
          ? ` {
            ${query}
          }`
          : ''
      }
        }
      `
    });
  }

  if (!!rawBody) {
    body = JSON.stringify(rawBody);
  }

  const abortController = new AbortController();
  activeRequests.push(abortController);

  try {
    const response = await fetch(url, {
      method,
      body,
      headers,
      signal: abortController.signal
    });

    let responseData;

    if (response.status === 204) {
      // 204 is successful response but no content
      responseData = {};
    } else {
      responseData = await response.json();
    }

    activeRequests.splice(
      activeRequests.findIndex((controller) => controller !== abortController),
      1
    );

    if (responseData.errors) {
      const errors = [];
      for (const error of responseData.errors) {
        errors.push(new Error(error.message));
      }
      await failureCallback(errors);
      return errors;
    } else if (resolver) {
      // a graphql request
      await successCallback(responseData.data[resolver]);
      return responseData.data[resolver];
    } else {
      await successCallback(responseData);
      return responseData;
    }
  } catch (error) {
    await failureCallback([error]);
    return [error];
  }
}

export function fancyFetch({
  args,
  rawBody,
  headers = {},
  method = 'POST',
  operation, // undefined, 'query' or 'mutation'
  query,
  resolver,
  url = process.env.REACT_APP_HTTP_URL
}) {
  if (
    url === process.env.REACT_APP_HTTP_URL &&
    !!Cookies.get('authentication_token')
  ) {
    headers.Authorization = `Bearer ${Cookies.get('authentication_token')}`;
  }

  if ((!!rawBody || !!resolver) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  let body;

  if (!!resolver) {
    body = JSON.stringify({
      query: `
        ${operation} {
          ${resolver}${args ? `(${args})` : ''}${
        query
          ? ` {
            ${query}
          }`
          : ''
      }
        }
      `
    });
  }

  if (!!rawBody) {
    body = JSON.stringify(rawBody);
  }

  fetch(url, {
    method,
    body,
    headers
  });
}
