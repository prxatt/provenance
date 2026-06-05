import LegalPageLayout from '@/components/LegalPageLayout';

export default function AuthenticationPage() {
  return (
    <LegalPageLayout
      kicker="Legal"
      title="Authentication Policy"
      intro="We use the word verified deliberately. Authentication is a process — not a marketing adjective."
      disclaimer="Do not claim third-party authentication unless documented. High-value pieces may require independent review before listing."
      sections={[
        {
          title: 'What Verified Means',
          body: 'A verified listing has undergone PROVENANCE review of reference, serial where applicable, dial/case/bracelet condition, movement where accessible, and included documentation.',
        },
        {
          title: 'Documentation',
          body: 'When available, box, papers, service records, and certificates are disclosed in the listing. Absence of documentation is also disclosed.',
        },
        {
          title: 'Remedy',
          body: 'If a sold item is proven not authentic under this policy within the stated review window, PROVENANCE will evaluate remedy options including refund or return subject to counsel-approved terms.',
        },
        {
          title: 'Layout Samples',
          body: 'Items marked Layout Sample are design references only. They are not authenticated inventory and cannot be purchased.',
        },
      ]}
    />
  );
}
