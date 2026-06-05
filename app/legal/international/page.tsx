import LegalPageLayout from '@/components/LegalPageLayout';

export default function InternationalPage() {
  return (
    <LegalPageLayout
      kicker="Legal"
      title="International Buyers & Customs"
      intro="PROVENANCE may ship internationally on a selective basis. Buyers are responsible for import compliance."
      sections={[
        {
          title: 'Duties & Taxes',
          body: 'Import duties, VAT, and customs fees are the buyer responsibility unless explicitly stated otherwise in writing.',
        },
        {
          title: 'Documentation',
          body: 'International shipments include commercial invoices and declared values required by customs authorities.',
        },
        {
          title: 'Restricted Items',
          body: 'Some materials or values may be restricted in certain jurisdictions. We reserve the right to decline international shipment.',
        },
      ]}
    />
  );
}
