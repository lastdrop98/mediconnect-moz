import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  icon: LucideIcon;
  gradient?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: { box: "w-9 h-9 rounded-lg", icon: "w-4 h-4" },
  md: { box: "w-12 h-12 rounded-xl", icon: "w-5 h-5" },
  lg: { box: "w-14 h-14 rounded-2xl", icon: "w-6 h-6" },
  xl: { box: "w-16 h-16 rounded-2xl", icon: "w-8 h-8" },
};

export function IconBadge({ icon: Icon, gradient = "from-primary to-primary-glow", size = "md", className }: Props) {
  const s = sizes[size];
  return (
    <div className={cn("flex items-center justify-center text-white shadow-soft bg-gradient-to-br", s.box, gradient, className)}>
      <Icon className={s.icon} />
    </div>
  );
}
