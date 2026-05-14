interface SpecRow {
  label: string;
  value: string;
}

interface SpecTableProps {
  specs: SpecRow[];
}

export function SpecTable({ specs }: SpecTableProps) {
  return (
    <div className="divide-y divide-pili-mist">
      {specs.map((spec) => (
        <div
          key={spec.label}
          className="flex items-baseline justify-between py-3"
        >
          <span className="text-xs font-medium uppercase tracking-wider text-pili-concrete">
            {spec.label}
          </span>
          <span className="font-mono text-sm font-medium text-pili-black">
            {spec.value}
          </span>
        </div>
      ))}
    </div>
  );
}
