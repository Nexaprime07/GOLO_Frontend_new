// ============================================================
// Centralized API Layer — Choja Frontend → ads-microservice
// ============================================================

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

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
            // Debug token format
            console.log(`[API] Using token for ${endpoint}: ${token.substring(0, 20)}...`);
            headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.warn(`[API] No token found in localStorage for ${endpoint}`);
        }
    }

    const config = {
        ...options,
        headers,
    };

    console.log(`[API] ${options.method || 'GET'} ${endpoint} with headers:`, {
        'Content-Type': headers['Content-Type'],
        'Authorization': headers['Authorization'] ? 'Present' : 'Missing',
    });

    const response = await fetch(url, config);

    // Handle 401 — try to refresh token
    if (response.status === 401 && typeof window !== 'undefined') {
        console.warn(`[API] Got 401 for ${endpoint} - attempting token refresh`);
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

export async function sendPasswordChangeOTP() {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (!token) {
            throw new Error('No authentication token found. Please login again.');
        }
        return apiClient('/users/send-password-otp', {
            method: 'POST',
        });
    } catch (error) {
        console.error('OTP Error:', error);
        throw error;
    }
}

export async function verifyPasswordChangeOTP(otp) {
    return apiClient('/users/verify-password-otp', {
        method: 'POST',
        body: JSON.stringify({ otp }),
    });
}

export async function changePasswordWithOTP(otp, newPassword) {
    return apiClient('/users/change-password-otp', {
        method: 'POST',
        body: JSON.stringify({ otp, newPassword }),
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

// ============================================================
// PAYMENTS APIs
// ============================================================

export async function createPaymentOrder(payload) {
    return apiClient('/payments/create-order', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export async function verifyPayment(payload) {
    return apiClient('/payments/verify', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export async function markPaymentFailed(payload) {
    return apiClient('/payments/fail', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export async function refundPayment(payload) {
    return apiClient('/payments/refund', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export async function getMyPayments({ page = 1, limit = 10, status } = {}) {
    const params = new URLSearchParams({ page, limit });
    if (status) params.append('status', status);
    return apiClient(`/payments/my?${params.toString()}`);
}

export async function getPaymentById(paymentId) {
    return apiClient(`/payments/${paymentId}`);
}

function loadRazorpayScript() {
    return new Promise((resolve) => {
        if (typeof window === 'undefined') return resolve(false);
        if (window.Razorpay) return resolve(true);

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

export async function openRazorpayCheckout({ amount, adId, description, notes, prefill }) {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
    }

    const orderResponse = await createPaymentOrder({
        amount,
        currency: 'INR',
        adId,
        description,
        notes,
        idempotencyKey: `pay_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    });

    const orderData = orderResponse?.data;
    const order = orderData?.order;
    const keyId = orderData?.keyId;
    const paymentRecord = orderData?.payment;

    if (!order || !keyId) {
        throw new Error('Invalid payment order response from server.');
    }

    return new Promise((resolve, reject) => {
        const razorpay = new window.Razorpay({
            key: keyId,
            amount: order.amount,
            currency: order.currency,
            name: 'GOLO',
            description: description || 'GOLO Payment',
            order_id: order.id,
            prefill: prefill || {},
            notes: notes || {},
            theme: {
                color: '#157A4F',
            },
            handler: async (response) => {
                try {
                    const verifyRes = await verifyPayment({
                        razorpayOrderId: response.razorpay_order_id,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpaySignature: response.razorpay_signature,
                    });
                    resolve({
                        success: true,
                        order,
                        paymentRecord,
                        verification: verifyRes?.data,
                    });
                } catch (error) {
                    reject(error);
                }
            },
            modal: {
                ondismiss: async () => {
                    try {
                        await markPaymentFailed({
                            razorpayOrderId: order.id,
                            failureDescription: 'Checkout closed by user',
                        });
                    } catch {
                    }
                    reject(new Error('Payment checkout was cancelled.'));
                },
            },
        });

        razorpay.on('payment.failed', async function (response) {
            try {
                await markPaymentFailed({
                    razorpayOrderId: order.id,
                    razorpayPaymentId: response?.error?.metadata?.payment_id,
                    failureCode: response?.error?.code,
                    failureDescription: response?.error?.description,
                });
            } catch {
            }
            reject(new Error(response?.error?.description || 'Payment failed.'));
        });

        razorpay.open();
    });
}

// ============================================================
// CHATS APIs
// ============================================================

export async function startConversation({ adId, sellerId }) {
    return apiClient('/chats/start', {
        method: 'POST',
        body: JSON.stringify({ adId, sellerId }),
    });
}

export async function getMyConversations() {
    return apiClient('/chats/conversations');
}

export async function getConversationMessages(conversationId, { page = 1, limit = 50 } = {}) {
    const params = new URLSearchParams({ page, limit });
    return apiClient(`/chats/conversations/${conversationId}/messages?${params.toString()}`);
}

export async function sendConversationMessage(conversationId, text, adId, attachments = []) {
    return apiClient(`/chats/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ text, adId, attachments }),
    });
}

export async function uploadChatAttachment(file) {
    if (!file) {
        throw new Error('No file selected');
    }

    if (file.size > 10 * 1024 * 1024) {
        throw new Error('Attachment is too large. Maximum size is 10MB.');
    }

    const mimeType = file.type || 'application/octet-stream';
    const isImage = mimeType.startsWith('image/');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'choja_preset');
    formData.append('cloud_name', 'dcm1plq42');

    const resourceType = isImage ? 'image' : 'auto';

    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/dcm1plq42/${resourceType}/upload`, {
        method: 'POST',
        body: formData,
    });

    const uploadData = await uploadResponse.json();
    if (!uploadResponse.ok || !uploadData?.secure_url) {
        throw new Error(uploadData?.error?.message || 'Attachment upload failed');
    }

    return {
        name: file.name,
        mimeType,
        size: file.size,
        type: isImage ? 'image' : 'file',
        url: uploadData.secure_url,
    };
}

export async function deleteConversation(conversationId) {
    return apiClient(`/chats/conversations/${conversationId}`, {
        method: 'DELETE',
    });
}
