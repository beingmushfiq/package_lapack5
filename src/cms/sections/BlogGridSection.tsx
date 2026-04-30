// CMS Section Wrapper: Blog Grid
import BlogSection from '../../components/BlogSection';
import type { CMSSectionProps } from '../types';
import { mergeStyles } from '../StyleEngine';

export default function BlogGridSection({ section }: CMSSectionProps) {
  const { className, style } = mergeStyles('', section.styles);

  return (
    <div className={className} style={style}>
      <BlogSection />
    </div>
  );
}
