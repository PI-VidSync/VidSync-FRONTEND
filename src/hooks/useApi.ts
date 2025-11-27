"use client"

const API_URL = import.meta.env.VITE_API_URL;

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
    const error = await response.json()
    throw new Error(error.message)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

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
    const error = await response.json()
    throw new Error(error.message)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export { request, requestHeader };
