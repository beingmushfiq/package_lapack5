// CMS Section Wrapper: Newsletter
import Newsletter from '../../components/Newsletter';
import type { CMSSectionProps } from '../types';
import { mergeStyles } from '../StyleEngine';

export default function NewsletterSection({ section }: CMSSectionProps) {
  const { className, style } = mergeStyles('', section.styles);

  return (
    <div className={className} style={style}>
      <Newsletter />
    </div>
  );
}
