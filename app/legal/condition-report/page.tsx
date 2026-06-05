import LegalPageLayout from '@/components/LegalPageLayout';

export default function ConditionReportPage() {
  return (
    <LegalPageLayout
      kicker="Legal"
      title="Condition Report Policy"
      intro="Condition is described honestly. We photograph marks, wear, and service evidence before listing."
      sections={[
        {
          title: 'Grading Approach',
          body: 'We use descriptive condition language — Excellent, Very Good, Collector Grade — supported by notes and imagery rather than numeric grades alone.',
        },
        {
          title: 'Disclosure',
          body: 'Scratches, stretch, polish, replacement parts, and service history are disclosed when known.',
        },
        {
          title: 'Buyer Responsibility',
          body: 'Review all images and notes before purchase. All sales are final unless otherwise stated.',
        },
      ]}
    />
  );
}
