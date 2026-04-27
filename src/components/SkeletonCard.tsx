const SkeletonCard = () => (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-5 space-y-5 animate-pulse h-full">
        <div className="aspect-square bg-slate-100 rounded-[1.5rem]" />
        <div className="space-y-3">
            <div className="h-3 bg-slate-100 rounded-full w-1/4" />
            <div className="h-5 bg-slate-100 rounded-lg w-full" />
            <div className="h-5 bg-slate-100 rounded-lg w-2/3" />
            
            <div className="pt-4 flex justify-between items-end border-t border-slate-50">
                <div className="space-y-2">
                    <div className="h-2 bg-slate-100 rounded-full w-12" />
                    <div className="h-8 bg-slate-100 rounded-xl w-24" />
                </div>
                <div className="h-10 w-24 bg-slate-100 rounded-xl" />
            </div>
        </div>
    </div>
);

export default SkeletonCard;
