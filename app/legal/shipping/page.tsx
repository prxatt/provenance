import LegalPageLayout from '@/components/LegalPageLayout';

export default function ShippingPage() {
  return (
    <LegalPageLayout
      kicker="Legal"
      title="Shipping & Insurance"
      intro="Every verified transfer is handled with insured, signature-required delivery appropriate to the value of the piece."
      sections={[
        {
          title: 'Insured Transfer',
          body: 'Shipments are insured for the declared value of the item. Insurance terms, carriers, and coverage limits will be disclosed at checkout before payment capture in production.',
        },
        {
          title: 'Signature Required',
          body: 'Delivery requires adult signature confirmation. We do not leave high-value packages unattended.',
        },
        {
          title: 'Discreet Packaging',
          body: 'Exterior packaging is discreet. Interior protection is designed for watches and jewelry.',
        },
        {
          title: 'International Buyers',
          body: 'International shipments may require customs documentation, duties, and extended timelines. See International Buyers policy for details.',
        },
      ]}
    />
  );
}
