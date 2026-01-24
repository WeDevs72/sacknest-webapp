/**
 * Detect user's country and return appropriate currency
 * @returns {Promise<string>} - 'INR' or 'USD'
 */
export async function detectCurrency() {
    try {
        // Try to get country from IP geolocation
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()

        // If user is from India, return INR, otherwise USD
        if (data.country_code === 'IN') {
            return 'INR'
        }

        return 'USD'
    } catch (error) {
        console.error('Error detecting currency:', error)

        // Fallback: Check timezone for India
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        if (timezone === 'Asia/Kolkata' || timezone === 'Asia/Calcutta') {
            return 'INR'
        }

        // Default to USD
        return 'USD'
    }
}

/**
 * Format price based on currency
 * @param {number} priceInr - Price in INR
 * @param {number} priceUsd - Price in USD
 * @param {string} currency - 'INR' or 'USD'
 * @returns {string} - Formatted price string
 */
export function formatPrice(priceInr, priceUsd, currency) {
    if (currency === 'INR') {
        return `₹${priceInr}`
    }
    return `$${priceUsd}`
}

/**
 * Get currency symbol
 * @param {string} currency - 'INR' or 'USD'
 * @returns {string} - Currency symbol
 */
export function getCurrencySymbol(currency) {
    return currency === 'INR' ? '₹' : '$'
}
