// CMS Section Wrapper: Brands Carousel
import BrandsSection from '../../components/BrandsSection';
import type { CMSSectionProps } from '../types';
import { mergeStyles } from '../StyleEngine';

export default function BrandsCarouselSection({ section }: CMSSectionProps) {
  const { className, style } = mergeStyles('', section.styles);

  return (
    <div className={className} style={style}>
      <BrandsSection />
    </div>
  );
}
