import { ShieldCheck, Award, Clock, FileCheck } from "lucide-react";

const CERTS = [
  { icon: ShieldCheck, label: "ISO 9001", desc: "Sistema de gestão da qualidade" },
  { icon: FileCheck, label: "NR-12", desc: "Segurança em máquinas e equipamentos" },
  { icon: Award, label: "NR-10", desc: "Segurança em instalações elétricas" },
  { icon: Clock, label: "5 anos", desc: "Garantia estrutural" },
] as const;

export function CertificationsBand() {
  return (
    <section className="bg-pili-white py-16 px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {CERTS.map((cert) => (
            <div key={cert.label} className="flex flex-col items-center text-center">
              <cert.icon className="h-10 w-10 text-pili-iron" />
              <span className="mt-3 font-display text-lg font-bold uppercase text-pili-black">
                {cert.label}
              </span>
              <span className="mt-1 text-sm text-pili-concrete">
                {cert.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
