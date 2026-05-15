"use client";

import { Link } from "@/i18n/routing";
import {
  ArrowRight,
  Truck,
  FlaskConical,
  ArrowUpDown,
  Wrench,
} from "lucide-react";
import { motion } from "framer-motion";

const CATEGORY_GRADIENTS: Record<string, string> = {
  TOMBADOR_FIXO: "bg-gradient-to-br from-gray-800 to-gray-900",
  TOMBADOR_MOVEL: "bg-gradient-to-br from-gray-700 to-gray-800",
  COLETOR_AMOSTRAS: "bg-gradient-to-br from-amber-900/20 to-gray-900",
  UNIDADE_TRANSBORDO: "bg-gradient-to-br from-blue-900/20 to-gray-900",
  ESPECIAL: "bg-gradient-to-br from-gray-800 to-gray-900",
};

const CATEGORY_ICONS: Record<string, typeof Truck> = {
  TOMBADOR_FIXO: Truck,
  TOMBADOR_MOVEL: Truck,
  COLETOR_AMOSTRAS: FlaskConical,
  UNIDADE_TRANSBORDO: ArrowUpDown,
  ESPECIAL: Wrench,
};

interface ProductCardProps {
  name: string;
  slug: string;
  category: string;
  capacity?: string;
  length?: string;
  image?: string;
}

export function ProductCard({
  name,
  slug,
  category,
  capacity,
  length,
  image,
}: ProductCardProps) {
  const gradientClass =
    CATEGORY_GRADIENTS[category] ??
    "bg-gradient-to-br from-gray-800 to-gray-900";
  const IconComponent = CATEGORY_ICONS[category] ?? Wrench;

  return (
    <motion.div
      whileHover={{ scale: 1.02, rotateY: 2 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link
        href={`/produtos/${slug}`}
        className="group relative flex flex-col overflow-hidden border border-pili-mist bg-pili-white transition-all hover:border-pili-black"
      >
        {/* Image area */}
        <div
          className={`relative aspect-[4/3] overflow-hidden ${image ? "bg-pili-paper" : gradientClass}`}
        >
          {image ? (
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <>
              {/* Diagonal line pattern overlay */}
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.5) 10px, rgba(255,255,255,0.5) 11px)",
                }}
              />
              {/* Large typographic length overlay */}
              {length && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-[6rem] font-black uppercase leading-none text-white/10 lg:text-[7rem]">
                    {length}
                  </span>
                </div>
              )}
              {/* Category icon top-right */}
              <div className="absolute right-3 top-3">
                <IconComponent className="h-6 w-6 text-white/20" />
              </div>
              {/* Category label bottom-left */}
              <div className="absolute bottom-3 left-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  {category.replace(/_/g, " ")}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-xl font-bold uppercase leading-tight text-pili-black">
            {name}
          </h3>

          {(capacity || length) && (
            <div className="mt-3 flex gap-4">
              {capacity && (
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-pili-cement">
                    Capacidade
                  </span>
                  <span className="font-mono text-sm font-medium text-pili-black">
                    {capacity}
                  </span>
                </div>
              )}
              {length && (
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-pili-cement">
                    Comprimento
                  </span>
                  <span className="font-mono text-sm font-medium text-pili-black">
                    {length}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="mt-auto pt-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-pili-black transition-colors group-hover:text-pili-safety-deep">
              Ver detalhes
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
