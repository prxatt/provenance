import LegalPageLayout from '@/components/LegalPageLayout';

export default function ConsignmentPage() {
  return (
    <LegalPageLayout
      kicker="Legal"
      title="Consignment Terms"
      intro="PROVENANCE may accept consignment on a selective basis. Terms are agreed in writing before any piece is listed."
      sections={[
        {
          title: 'Eligibility',
          body: 'Consignment is by invitation. We evaluate brand, condition, documentation, and market fit before acceptance.',
        },
        {
          title: 'Pricing & Approval',
          body: 'Listing price and terms require owner approval. PROVENANCE may recommend pricing based on market conditions.',
        },
        {
          title: 'Payout',
          body: 'Payout timing and method are defined in the consignment agreement. Production will use counsel-approved escrow or marketplace payout structures.',
        },
      ]}
    />
  );
}
