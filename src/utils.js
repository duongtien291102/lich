export const DAYS_IN_MONTH = 31;
export const THRESHOLD = 250000;
export const FIRST_DAY_INDEX = 4; // Jan 1, 2026 is Thursday

export function formatMoney(amount) {
    if (!amount) return '0';
    if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1).replace('.0', '') + ' M';
    } else if (amount >= 1000) {
        return Math.round(amount / 1000) + ' K';
    }
    return amount.toLocaleString('vi-VN');
}

export function parseMoney(input) {
    if (!input) return 0;
    let str = input.toString().toLowerCase().trim();
    let multiplier = 1;

    if (str.includes('k')) {
        multiplier = 1000;
        str = str.replace('k', '');
    } else if (str.includes('m')) {
        multiplier = 1000000;
        str = str.replace('m', '');
    }

    str = str.replace(/[^0-9.,]/g, '');
    str = str.replace(',', '.');

    return parseFloat(str) * multiplier || 0;
}
