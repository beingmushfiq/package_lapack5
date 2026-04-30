// CMS Section Wrapper: Client Reviews
import ClientReviews from '../../components/ClientReviews';
import type { CMSSectionProps } from '../types';
import { mergeStyles } from '../StyleEngine';

export default function ReviewsSection({ section }: CMSSectionProps) {
  const { className, style } = mergeStyles('', section.styles);

  return (
    <div className={className} style={style}>
      <ClientReviews />
    </div>
  );
}
