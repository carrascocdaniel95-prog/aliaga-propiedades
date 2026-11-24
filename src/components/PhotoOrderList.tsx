import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, X } from 'lucide-react';

interface PhotoOrderListProps {
  images: string[];
  onChange: (images: string[]) => void;
}

const moveItem = (list: string[], from: number, to: number) => {
  const updated = [...list];
  const [item] = updated.splice(from, 1);
  updated.splice(to, 0, item);
  return updated;
};

/** Miniaturas de las fotos: se reordenan arrastrando (computador) o con flechas (celular). La primera es la portada. */
export const PhotoOrderList: React.FC<PhotoOrderListProps> = ({ images, onChange }) => {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const move = (from: number, to: number) => {
    if (from === to || to < 0 || to >= images.length) return;
    onChange(moveItem(images, from, to));
  };

  const endDrag = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  const iconButton = 'p-1 rounded-md text-white hover:bg-white/25 disabled:opacity-30 disabled:hover:bg-transparent';

  return (
    <div>
      <span className="text-[11px] font-bold text-slate-500 mb-1.5 block">
        Fotos ({images.length}). Arrástralas o usa las flechas para cambiar el orden; la primera es la portada.
      </span>
      <div className="flex flex-wrap gap-2">
        {images.map((url, idx) => (
          <div
            key={`${idx}-${url}`}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('text/plain', String(idx));
              setDragIndex(idx);
            }}
            onDragOver={(e) => {
              if (dragIndex === null) return;
              e.preventDefault();
              setOverIndex(idx);
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (dragIndex !== null) move(dragIndex, idx);
              endDrag();
            }}
            onDragEnd={endDrag}
            className={`relative w-32 h-24 rounded-xl overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all ${
              overIndex === idx && dragIndex !== idx ? 'border-teal-500 scale-105' : idx === 0 ? 'border-amber-400' : 'border-slate-200'
            } ${dragIndex === idx ? 'opacity-40' : ''}`}
          >
            <img src={url} alt={`Foto ${idx + 1}`} draggable={false} className="w-full h-full object-cover" />

            <span
              className={`absolute top-1 left-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                idx === 0 ? 'bg-amber-400 text-slate-900' : 'bg-black/70 text-white'
              }`}
            >
              {idx === 0 ? 'Portada' : idx + 1}
            </span>

            <button
              type="button"
              title="Quitar foto"
              onClick={() => onChange(images.filter((_, i) => i !== idx))}
              className="absolute top-1 right-1 p-0.5 rounded-full bg-black/70 text-white hover:bg-rose-600"
            >
              <X className="w-3 h-3" />
            </button>

            <div className="absolute bottom-0 inset-x-0 flex items-center justify-between bg-black/60 px-0.5">
              <button
                type="button"
                title="Mover a la izquierda"
                disabled={idx === 0}
                onClick={() => move(idx, idx - 1)}
                className={iconButton}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                title="Usar como portada"
                disabled={idx === 0}
                onClick={() => move(idx, 0)}
                className={iconButton}
              >
                <Star className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                title="Mover a la derecha"
                disabled={idx === images.length - 1}
                onClick={() => move(idx, idx + 1)}
                className={iconButton}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
