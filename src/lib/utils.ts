import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
    // Backend returns millimes (e.g. 2259000 = 2,259.000 DT)
    const dtPrice = price / 1000;
    return new Intl.NumberFormat('fr-TN', {
        style: 'currency',
        currency: 'TND',
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
    }).format(dtPrice).replace('TND', 'DT');
}

export function toMillimes(dtAmount: number | string): number {
    return Math.round(Number(dtAmount) * 1000);
}

export function formatDate(dateString: string | Date): string {
    return new Date(dateString).toLocaleDateString('fr-TN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}
