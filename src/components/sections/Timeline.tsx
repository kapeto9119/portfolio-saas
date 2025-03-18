interface TimelineItem {
  date: string;
  title: string;
  description: string;
  icon?: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
      {items.map((item, index) => (
        <div key={index} className="relative flex items-center">
          <div className="absolute left-0 mt-1 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            {item.icon ? (
              <span className="text-xl">{item.icon}</span>
            ) : (
              <span className="h-3 w-3 rounded-full bg-primary" />
            )}
          </div>
          <div className="ml-16">
            <div className="font-semibold text-sm text-muted-foreground">
              {item.date}
            </div>
            <h3 className="font-semibold mt-1">{item.title}</h3>
            <div className="text-muted-foreground mt-1">
              {item.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 