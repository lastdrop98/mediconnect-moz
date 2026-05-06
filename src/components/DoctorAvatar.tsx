import { cn } from "@/lib/utils";

interface Props {
  src: string;
  name: string;
  online?: boolean;
  size?: number;
  className?: string;
  ring?: boolean;
}

export function DoctorAvatar({ src, name, online, size = 56, className, ring }: Props) {
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <img
        src={src}
        alt={name}
        loading="lazy"
        width={size}
        height={size}
        className={cn(
          "w-full h-full rounded-2xl object-cover bg-muted",
          ring && "ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
        )}
      />
      {online !== undefined && (
        <span className="absolute -bottom-0.5 -right-0.5 flex">
          <span className={cn(
            "w-3.5 h-3.5 rounded-full border-2 border-card",
            online ? "bg-success" : "bg-muted-foreground"
          )} />
          {online && (
            <span className="absolute inset-0 rounded-full bg-success animate-ping-soft" />
          )}
        </span>
      )}
    </div>
  );
}
