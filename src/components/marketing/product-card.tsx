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
import { getProductImage } from "@/lib/product-images";

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
  const resolvedImage = image ?? getProductImage(slug, category);
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
        <div className="relative aspect-4/3 overflow-hidden bg-pili-graphite">
          <img
            src={resolvedImage}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Category icon top-right */}
          <div className="absolute right-3 top-3">
            <IconComponent className="h-6 w-6 text-white/30" />
          </div>
          {/* Category label bottom-left */}
          <div className="absolute bottom-3 left-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">
              {category.replace(/_/g, " ")}
            </span>
          </div>
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
