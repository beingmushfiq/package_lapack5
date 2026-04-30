// CMS Section Wrapper: Category Grid
import CategoryList from '../../components/CategoryList';
import type { CMSSectionProps } from '../types';
import { mergeStyles } from '../StyleEngine';

export default function CategoryGridSection({ section, onCategorySeeMore }: CMSSectionProps) {
  const { className, style } = mergeStyles('', section.styles);

  return (
    <div className={className} style={style}>
      <CategoryList onSeeMoreClick={onCategorySeeMore || (() => {})} />
    </div>
  );
}
