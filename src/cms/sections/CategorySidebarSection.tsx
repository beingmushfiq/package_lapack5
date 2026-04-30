// CMS Section Wrapper: Category Sidebar
import CategorySidebar from '../../components/CategorySidebar';
import type { CMSSectionProps } from '../types';
import { mergeStyles } from '../StyleEngine';

export default function CategorySidebarSection({ section, onCategorySeeMore }: CMSSectionProps) {
  const { className, style } = mergeStyles('', section.styles);

  return (
    <div className={className} style={style}>
      <CategorySidebar onViewAll={onCategorySeeMore || (() => {})} />
    </div>
  );
}
