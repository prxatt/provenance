import LegalPageLayout from '@/components/LegalPageLayout';

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      kicker="Legal"
      title="Privacy Policy"
      intro="PROVENANCE collects only the information required to respond to access requests, process orders, and operate the site."
      disclaimer="Have U.S. counsel review for CCPA/state privacy compliance before production launch."
      sections={[
        {
          title: 'Information We Collect',
          body: 'Contact details submitted through access or checkout forms, order history associated with your requests, and standard analytics data via Vercel Analytics.',
        },
        {
          title: 'How We Use Information',
          body: 'To respond to collector inquiries, process purchase requests, prevent fraud, and improve the experience. We do not sell personal information.',
        },
        {
          title: 'Retention & Security',
          body: 'Data is stored securely and retained only as long as needed for business and legal purposes. Production will migrate storage to encrypted database infrastructure.',
        },
        {
          title: 'Your Choices',
          body: 'You may request access or deletion of personal information by contacting PROVENANCE through the access page. We will respond within a reasonable timeframe.',
        },
      ]}
    />
  );
}
