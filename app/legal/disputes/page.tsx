import LegalPageLayout from '@/components/LegalPageLayout';

export default function DisputesPage() {
  return (
    <LegalPageLayout
      kicker="Legal"
      title="Dispute Policy"
      intro="High-value commerce requires clear process. This policy outlines how disputes are handled."
      sections={[
        {
          title: 'Contact First',
          body: 'Contact PROVENANCE promptly with order details and supporting documentation. Many issues resolve through concierge review.',
        },
        {
          title: 'Chargebacks',
          body: 'Unauthorized chargebacks on completed, documented deliveries may be contested with carrier proof of delivery and listing disclosures.',
        },
        {
          title: 'Governing Law',
          body: 'Disputes are governed by the laws specified in counsel-reviewed Terms of Sale. Have counsel define venue and arbitration if required.',
        },
      ]}
    />
  );
}
