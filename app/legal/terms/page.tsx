import LegalPageLayout from '@/components/LegalPageLayout';

const disclaimer =
  'This page provides operational policy language for the PROVENANCE prototype. Have qualified U.S. counsel review all terms before accepting live transactions.';

export default function TermsPage() {
  return (
    <LegalPageLayout
      kicker="Legal"
      title="Terms of Sale"
      intro="By engaging with PROVENANCE, you agree to the following standards and disclosures for high-value pre-owned goods."
      disclaimer={disclaimer}
      sections={[
        {
          title: 'All Sales Final',
          body: 'All sales are final once a purchase is completed. Please review images, condition notes, reference information, and included documentation before purchase. Returns are not offered except where required by applicable law or expressly stated in writing.',
        },
        {
          title: 'Pre-Owned Condition',
          body: 'Watches and jewelry may show signs of wear consistent with age and use unless otherwise stated. We provide clear condition reporting and high-resolution imagery. You are responsible for reviewing the listing before purchase.',
        },
        {
          title: 'Authenticity Guarantee',
          body: 'Items represented as verified have undergone PROVENANCE review appropriate to the listing. We do not claim third-party laboratory certification unless explicitly disclosed. If an item is proven not authentic under our authentication policy, we will review and remedy according to that policy.',
        },
        {
          title: 'Shipping & Insurance',
          body: 'Eligible orders ship fully insured with signature confirmation and discreet packaging. Risk of loss transfers according to the carrier terms and our shipping policy once the shipment is accepted by the carrier.',
        },
        {
          title: 'High-Value Review',
          body: 'Orders above $25,000 may require additional identity verification, payment review, and private purchase approval before fulfillment.',
        },
      ]}
    />
  );
}
