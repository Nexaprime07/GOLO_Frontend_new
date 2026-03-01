// ============================================================
// Centralized API Layer — Choja Frontend → ads-microservice
// ============================================================

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// --------------- Core Fetch Wrapper ---------------

async function apiClient(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Attach JWT token if available
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const config = {
        ...options,
        headers,
    };

    const response = await fetch(url, config);

    // Handle 401 — try to refresh token
    if (response.status === 401 && typeof window !== 'undefined') {
        const refreshed = await tryRefreshToken();
        if (refreshed) {
            // Retry original request with new token
            headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
            const retryResponse = await fetch(url, { ...config, headers });
            return handleResponse(retryResponse);
        }
    }

    return handleResponse(response);
}

async function handleResponse(response) {
    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message || 'API request failed');
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}

async function tryRefreshToken() {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) return false;

        const response = await fetch(`${BASE_URL}/users/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            // Refresh failed — clear tokens
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            return false;
        }

        const data = await response.json();
        localStorage.setItem('accessToken', data.data.accessToken);
        if (data.data.refreshToken) {
            localStorage.setItem('refreshToken', data.data.refreshToken);
        }
        return true;
    } catch {
        return false;
    }
}

// ============================================================
// AUTH APIs
// ============================================================

export async function loginUser(email, password) {
    return apiClient('/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}

export async function registerUser({ name, email, password, phone }) {
    return apiClient('/users/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, phone }),
    });
}

export async function refreshTokenApi(refreshToken) {
    return apiClient('/users/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
    });
}

export async function logoutUser(refreshToken) {
    return apiClient('/users/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
    });
}

// ============================================================
// USER / PROFILE APIs
// ============================================================

export async function getProfile() {
    return apiClient('/users/profile');
}

export async function updateProfile(data) {
    return apiClient('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

// ============================================================
// ADS — PUBLIC APIs (no auth required)
// ============================================================

export async function getAllAds({ page = 1, limit = 10, category, sortBy, sortOrder } = {}) {
    const params = new URLSearchParams({ page, limit });
    if (category) params.append('category', category);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);
    return apiClient(`/ads?${params}`);
}

export async function searchAds({ q = '', category, location, minPrice, maxPrice, page = 1, limit = 10 } = {}) {
    const params = new URLSearchParams({ q, page, limit });
    if (category) params.append('category', category);
    if (location) params.append('location', location);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    return apiClient(`/ads/search?${params}`);
}

export async function getAdById(adId) {
    return apiClient(`/ads/${adId}`);
}

export async function getAdsByCategory(category, { page = 1, limit = 10 } = {}) {
    const params = new URLSearchParams({ page, limit });
    return apiClient(`/ads/category/${encodeURIComponent(category)}?${params}`);
}

export async function getFeaturedDeals(limit = 10) {
    return apiClient(`/ads/home/featured?limit=${limit}`);
}

export async function getTrendingSearches(limit = 10) {
    return apiClient(`/ads/home/trending?limit=${limit}`);
}

export async function getRecommendedDeals(limit = 10) {
    return apiClient(`/ads/home/recommended?limit=${limit}`);
}

export async function getPopularPlaces(limit = 10) {
    return apiClient(`/ads/home/popular-places?limit=${limit}`);
}

export async function getNearbyAds({ lat, lng, distance = 10000, category, page = 1, limit = 10 } = {}) {
    const params = new URLSearchParams({ lat, lng, distance, page, limit });
    if (category) params.append('category', category);
    return apiClient(`/ads/nearby?${params}`);
}

// ============================================================
// ADS — AUTHENTICATED APIs
// ============================================================

export async function createAd(adData) {
    return apiClient('/ads', {
        method: 'POST',
        body: JSON.stringify(adData),
    });
}

export async function updateAd(adId, updateData) {
    return apiClient(`/ads/${adId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
    });
}

export async function deleteAd(adId) {
    return apiClient(`/ads/${adId}`, {
        method: 'DELETE',
    });
}

export async function getMyAds({ page = 1, limit = 10 } = {}) {
    const params = new URLSearchParams({ page, limit });
    return apiClient(`/ads/user/me?${params}`);
}

export async function getAdsByUser(userId, { page = 1, limit = 10 } = {}) {
    const params = new URLSearchParams({ page, limit });
    return apiClient(`/ads/user/${userId}?${params}`);
}

export async function promoteAd(adId, { promotionPackage, duration }) {
    return apiClient(`/ads/${adId}/promote`, {
        method: 'POST',
        body: JSON.stringify({ package: promotionPackage, duration }),
    });
}
