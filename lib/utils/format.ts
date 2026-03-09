/**
 * Format amount in paisa to Indian rupee display format.
 * @param paisa Amount in paisa (100 paisa = ₹1)
 * @returns Formatted string like "₹12,34,567" or "₹12.5 Cr"
 */
export function formatCurrency(paisa: number | null | undefined): string {
    if (paisa == null) return '₹0'

    const rupees = paisa / 100

    if (rupees >= 1_00_00_000) {
        const crores = rupees / 1_00_00_000
        return `₹${crores % 1 === 0 ? crores : crores.toFixed(1)} Cr`
    }
    if (rupees >= 1_00_000) {
        const lakhs = rupees / 1_00_000
        return `₹${lakhs % 1 === 0 ? lakhs : lakhs.toFixed(1)} L`
    }

    // Indian number formatting
    return '₹' + rupees.toLocaleString('en-IN', { maximumFractionDigits: 0 })
}

/**
 * Format a date string to relative time like "3 hours ago", "Yesterday", etc.
 */
export function formatRelativeTime(dateStr: string | null | undefined): string {
    if (!dateStr) return ''

    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSecs < 60) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`

    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

/**
 * Format a number to compact form like "12.4K", "1.2M"
 */
export function formatCompact(num: number | null | undefined): string {
    if (num == null) return '0'
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
    return num.toString()
}

/**
 * Generate a URL-safe slug from a string.
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

/**
 * Extract initials from a name.
 */
export function getInitials(name: string | null | undefined): string {
    if (!name) return '?'
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}
