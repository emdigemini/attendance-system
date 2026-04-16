const SummaryCard = ({ count, name, label = "This Semester", color = "green" }) => {
  const colorMap = {
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
  };

  return (
    <div className="flex flex-col gap-1 p-5 w-full md:bg-white md:border md:border-slate-100 rounded-2xl md:shadow-sm md:hover:shadow-md transition-shadow">
      <span className="text-slate-500 text-[10px] font-light md:text-sm md:font-medium uppercase tracking-wider">
        {name}
      </span>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl md:text-4xl font-bold text-slate-900">{count || 0}</span>
        <span className="hidden md:block text-slate-400 md:text-sm font-normal">{label}</span>
      </div>
        <span className="md:hidden text-slate-400 text-[10px] md:text-sm font-normal">{label}</span>
      <div className={`h-1 w-8 hidden md:block rounded-full ${colorMap[color] || 'bg-slate-500'} mt-2`} />
    </div>
  );
};

export default SummaryCard