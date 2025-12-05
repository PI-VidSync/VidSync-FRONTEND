"use client";

import { getIdToken } from "@/service/firebase/token";

const API_URL = import.meta.env.VITE_API_URL;

const request = async <T>(url: string, method: string, body?: T) => {
    const response = await fetch(API_URL + url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) throw new Error((await response.json()).message);
    if (response.status === 204) return null;
    return response.json();
};

const requestHeader = async <T>(
    url: string,
    method: string,
    body?: T
) => {
    const token = await getIdToken();

    if (!token) throw ("No hay token disponible");

    const response = await fetch(API_URL + url, {
        method,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) throw new Error((await response.json()).message);
    if (response.status === 204) return null;
    return response.json();
};

export { request, requestHeader };
