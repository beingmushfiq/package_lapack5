// CMS Section Wrapper: FAQ Accordion
import FAQSection from '../../components/FAQSection';
import type { CMSSectionProps } from '../types';
import { mergeStyles } from '../StyleEngine';

export default function FAQAccordionSection({ section }: CMSSectionProps) {
  const { className, style } = mergeStyles('', section.styles);

  return (
    <div className={className} style={style}>
      <FAQSection />
    </div>
  );
}
