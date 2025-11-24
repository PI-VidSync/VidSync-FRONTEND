"use client"

const API_URL = import.meta.env.VITE_API_URL;

const useRequest = async <T>(url: string, method: string, body?: T) => {
  try {
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
  } catch (error) {
    throw error
  }
}

const useRequestHeader = async <T>(url: string, method: string, headers: any, body?: T) => {
  try {
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
  } catch (error) {
    throw error
  }
}

export { useRequest, useRequestHeader };
