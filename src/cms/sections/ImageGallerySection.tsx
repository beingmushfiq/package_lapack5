// ImageGallerySection — CMS-driven responsive image grid/masonry
import { motion } from 'framer-motion';
import type { CMSSectionProps } from '../types';
import { resolveStyles } from '../StyleEngine';

interface GalleryImage {
  url: string;
  alt?: string;
  title?: string;
  colSpan?: number; // Tailwind col-span (1, 2)
  rowSpan?: number; // Tailwind row-span (1, 2)
}

export default function ImageGallerySection({ section }: CMSSectionProps) {
  const images: GalleryImage[] = section.components?.images || [];
  const columns = section.components?.columns || 4; // Default 4 cols
  const gap = section.components?.gap || '16px';
  
  const styles = resolveStyles(section.styles);

  if (!images.length) return null;

  return (
    <section className="py-8" style={styles}>
      <div className="container mx-auto px-4">
        {section.title && (
          <h2 className="text-2xl font-bold mb-6 text-center">{section.title}</h2>
        )}
        
        <div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
          style={{ 
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            gap: gap
          }}
        >
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative overflow-hidden rounded-xl group bg-gray-100 ${
                img.colSpan ? `lg:col-span-${img.colSpan}` : ''
              } ${
                img.rowSpan ? `lg:row-span-${img.rowSpan}` : ''
              }`}
            >
              <img
                src={img.url}
                alt={img.alt || section.title || 'Gallery Image'}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 aspect-square"
              />
              
              {(img.title) && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-white font-medium text-sm translate-y-2 group-hover:translate-y-0 transition-transform">
                    {img.title}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
