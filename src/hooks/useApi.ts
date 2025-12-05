"use client"
/**
 * Base API URL sourced from environment variables.
 */
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Perform a JSON request using fetch with credentials.
 * @template T Request body type
 * @param url Resource path relative to `API_URL`
 * @param method HTTP method
 * @param body Optional request body
 * @returns Parsed JSON response or `null` for 204
 * @throws Error with server-provided message when response is not OK
 */
const request = async <T>(url: string, method: string, body?: T) => {
  const response = await fetch(API_URL + url, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  if (!response.ok) {
    const error = await response.json();
    const message = error?.message ?? error?.error ?? "Error en la solicitud";
    throw new Error(message);
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

/**
 * Perform a JSON request including custom headers.
 * @template T Request body type
 * @param url Resource path relative to `API_URL`
 * @param method HTTP method
 * @param headers Additional headers such as authorization
 * @param body Optional request body
 */
const requestHeader = async <T>(url: string, method: string, headers: { Authorization: string }, body?: T) => {
  const response = await fetch(API_URL + url, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  if (!response.ok) {
    const error = await response.json();
    const message = error?.message ?? error?.error ?? "Error en la solicitud";
    throw new Error(message);
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export { request, requestHeader };
