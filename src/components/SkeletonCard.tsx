const SkeletonCard = () => (
    <div className="premium-card overflow-hidden animate-pulse">
        <div className="aspect-square bg-slate-200" />
        <div className="p-5 space-y-3">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
            <div className="pt-4 border-t border-slate-50 flex justify-between items-end">
                <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-16" />
                    <div className="h-6 bg-slate-200 rounded w-24" />
                </div>
                <div className="h-10 w-10 bg-slate-200 rounded-lg" />
            </div>
        </div>
    </div>
);

export default SkeletonCard;
