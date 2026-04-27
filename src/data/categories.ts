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

export const ALL_CATEGORIES: TopCategory[] = [
    ...TOP_CATEGORIES,
    {
        slug: 'telephonie',
        label: 'Téléphonie & Mobile',
        icon: '📱',
        parentCategory: 'Téléphonie',
        color: 'violet',
        gradient: 'from-violet-400 to-purple-600',
        hoverGradient: 'from-violet-500 to-purple-700',
        bgLight: 'bg-violet-50',
        textColor: 'text-violet-600',
    },
    {
        slug: 'gaming',
        label: 'Gaming',
        icon: '🎮',
        parentCategory: 'Gaming',
        color: 'red',
        gradient: 'from-red-400 to-rose-600',
        hoverGradient: 'from-red-500 to-rose-700',
        bgLight: 'bg-red-50',
        textColor: 'text-red-600',
    },
    {
        slug: 'impression',
        label: 'Impression & Print',
        icon: '🖨️',
        parentCategory: 'Impression',
        color: 'cyan',
        gradient: 'from-cyan-400 to-blue-600',
        hoverGradient: 'from-cyan-500 to-blue-700',
        bgLight: 'bg-cyan-50',
        textColor: 'text-cyan-600',
    },
    {
        slug: 'reseau',
        label: 'Réseau & Connectivity',
        icon: '🌐',
        parentCategory: 'Réseau',
        color: 'indigo',
        gradient: 'from-indigo-400 to-blue-600',
        hoverGradient: 'from-indigo-500 to-blue-700',
        bgLight: 'bg-indigo-50',
        textColor: 'text-indigo-600',
    },
    {
        slug: 'audio-video',
        label: 'Audio & Vidéo',
        icon: '🎧',
        parentCategory: 'Audio & Vidéo',
        color: 'fuchsia',
        gradient: 'from-fuchsia-400 to-purple-600',
        hoverGradient: 'from-fuchsia-500 to-purple-700',
        bgLight: 'bg-fuchsia-50',
        textColor: 'text-fuchsia-600',
    },
    {
        slug: 'securite',
        label: 'Sécurité & Alarme',
        icon: '🔒',
        parentCategory: 'Sécurité',
        color: 'slate',
        gradient: 'from-slate-600 to-gray-800',
        hoverGradient: 'from-slate-700 to-gray-900',
        bgLight: 'bg-slate-50',
        textColor: 'text-slate-600',
    },
    {
        slug: 'bureautique',
        label: 'Bureautique',
        icon: '📎',
        parentCategory: 'Bureautique',
        color: 'yellow',
        gradient: 'from-yellow-400 to-amber-600',
        hoverGradient: 'from-yellow-500 to-amber-700',
        bgLight: 'bg-yellow-50',
        textColor: 'text-yellow-600',
    },
    {
        slug: 'autres',
        label: 'Autres & Divers',
        icon: '🔌',
        parentCategory: 'Autres',
        color: 'emerald',
        gradient: 'from-emerald-400 to-green-600',
        hoverGradient: 'from-emerald-500 to-green-700',
        bgLight: 'bg-emerald-50',
        textColor: 'text-emerald-600',
    },
    {
        slug: 'animaux',
        label: 'Animaux & Pets',
        icon: '🐾',
        parentCategory: 'Animaux',
        color: 'amber',
        gradient: 'from-amber-400 to-yellow-600',
        hoverGradient: 'from-amber-500 to-yellow-700',
        bgLight: 'bg-amber-50',
        textColor: 'text-amber-600',
    },
];

/**
 * Look up a category by its URL slug (e.g. "tech").
 */
export function getCategoryBySlug(slug: string): TopCategory | undefined {
    return ALL_CATEGORIES.find((c) => c.slug === slug);
}

/**
 * Look up a category by its backend parentCategory value (e.g. "Informatique").
 */
export function getCategoryByParent(parent: string): TopCategory | undefined {
    return ALL_CATEGORIES.find((c) => c.parentCategory === parent);
}
