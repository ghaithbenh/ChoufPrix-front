export interface TopCategory {
    slug: string;
    label: string;
    icon: string;
    parentCategory: string;
    color: string;
    gradient: string;
    hoverGradient: string;
    bgLight: string;
    textColor: string;
}

export const TOP_CATEGORIES: TopCategory[] = [
    {
        slug: 'tech',
        label: 'Tech & Electronics',
        icon: '💻',
        parentCategory: 'Informatique',
        color: 'blue',
        gradient: 'from-blue-500 to-indigo-600',
        hoverGradient: 'from-blue-600 to-indigo-700',
        bgLight: 'bg-blue-50',
        textColor: 'text-blue-600',
    },
    {
        slug: 'home',
        label: 'Home & Appliances',
        icon: '🏠',
        parentCategory: 'Maison',
        color: 'orange',
        gradient: 'from-orange-400 to-amber-600',
        hoverGradient: 'from-orange-500 to-amber-700',
        bgLight: 'bg-orange-50',
        textColor: 'text-orange-600',
    },
    {
        slug: 'fashion',
        label: 'Fashion',
        icon: '👗',
        parentCategory: 'Mode',
        color: 'pink',
        gradient: 'from-pink-400 to-rose-600',
        hoverGradient: 'from-pink-500 to-rose-700',
        bgLight: 'bg-pink-50',
        textColor: 'text-pink-600',
    },
    {
        slug: 'beauty',
        label: 'Beauty & Health',
        icon: '💄',
        parentCategory: 'Beauté',
        color: 'rose',
        gradient: 'from-rose-400 to-fuchsia-600',
        hoverGradient: 'from-rose-500 to-fuchsia-700',
        bgLight: 'bg-rose-50',
        textColor: 'text-rose-600',
    },
    {
        slug: 'auto',
        label: 'Auto & Moto',
        icon: '🚗',
        parentCategory: 'Auto',
        color: 'gray',
        gradient: 'from-slate-500 to-gray-700',
        hoverGradient: 'from-slate-600 to-gray-800',
        bgLight: 'bg-slate-50',
        textColor: 'text-slate-600',
    },
    {
        slug: 'secondhand',
        label: 'Second Hand',
        icon: '♻️',
        parentCategory: 'Tayara',
        color: 'teal',
        gradient: 'from-teal-400 to-emerald-600',
        hoverGradient: 'from-teal-500 to-emerald-700',
        bgLight: 'bg-teal-50',
        textColor: 'text-teal-600',
    },
];

/**
 * Look up a category by its URL slug (e.g. "tech").
 */
export function getCategoryBySlug(slug: string): TopCategory | undefined {
    return TOP_CATEGORIES.find((c) => c.slug === slug);
}

/**
 * Look up a category by its backend parentCategory value (e.g. "Informatique").
 */
export function getCategoryByParent(parent: string): TopCategory | undefined {
    return TOP_CATEGORIES.find((c) => c.parentCategory === parent);
}
