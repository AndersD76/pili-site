import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon?: string;
}

interface FeatureGridProps {
  features: Feature[];
}

function getIcon(name: string): LucideIcon | null {
  const icons = LucideIcons as unknown as Record<string, LucideIcon>;
  return icons[name] ?? null;
}

export function FeatureGrid({ features }: FeatureGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature, i) => {
        const IconComponent = feature.icon ? getIcon(feature.icon) : null;

        return (
          <div key={feature.title} className="border border-pili-mist p-6">
            <div className="flex items-center gap-3">
              {IconComponent ? (
                <IconComponent className="h-5 w-5 text-pili-safety" />
              ) : (
                <span className="font-mono text-lg font-bold text-pili-safety">
                  {String(i + 1).padStart(2, "0")}
                </span>
              )}
              <h3 className="font-display text-base font-bold uppercase text-pili-black">
                {feature.title}
              </h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-pili-concrete">
              {feature.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
