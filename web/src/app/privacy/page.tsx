import { PageShell } from "@/components/page-shell"

// Prose styles for headings, paragraphs and lists, without a typography plugin.
const prose =
  "max-w-none text-foreground/85 leading-relaxed [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-foreground [&_h3]:mt-8 [&_h3]:font-sans [&_h3]:text-base [&_h3]:font-medium [&_h3]:text-foreground [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 [&_a]:underline [&_a]:underline-offset-4 [&_strong]:text-foreground"

export default function PrivacyPolicyPage() {
  return (
    <PageShell title="Privacy policy" intro="Last updated 11 November 2026" width="narrow">
      <div className={prose}>
        <h2>1. Introduction</h2>
        <p>
          At Wamumbi, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
        </p>

        <h2>2. Information We Collect</h2>
        <h3>2.1 Personal Information</h3>
        <p>
          We may collect personal information that you provide directly to us, including:
        </p>
        <ul>
          <li>Name and contact information (email address, phone number, mailing address)</li>
          <li>Payment information for donations</li>
          <li>Volunteer application information</li>
          <li>Emergency contact information</li>
          <li>Account credentials</li>
          <li>Communications you send to us</li>
        </ul>

        <h3>2.2 Automatically Collected Information</h3>
        <p>
          When you visit our website, we may automatically collect certain information, including:
        </p>
        <ul>
          <li>IP address and browser type</li>
          <li>Device information</li>
          <li>Pages visited and time spent on pages</li>
          <li>Referring website addresses</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>
          We use the information we collect for various purposes, including:
        </p>
        <ul>
          <li>Processing donations and issuing tax receipts</li>
          <li>Managing volunteer applications and activities</li>
          <li>Communicating with you about our programs and services</li>
          <li>Sending newsletters and updates (with your consent)</li>
          <li>Improving our website and services</li>
          <li>Ensuring the security of our website</li>
          <li>Complying with legal obligations</li>
          <li>Responding to your inquiries and requests</li>
        </ul>

        <h2>4. Information Sharing and Disclosure</h2>
        <p>
          We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
        </p>
        <ul>
          <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our website and conducting our activities</li>
          <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
          <li><strong>With Your Consent:</strong> When you have given us explicit permission to share your information</li>
          <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
        </ul>

        <h2>5. Data Security</h2>
        <p>
          We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
        </p>
        <ul>
          <li>Encryption of sensitive data</li>
          <li>Secure server infrastructure</li>
          <li>Regular security assessments</li>
          <li>Access controls and authentication</li>
          <li>Employee training on data protection</li>
        </ul>

        <h2>6. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to enhance your experience on our website. Cookies are small data files stored on your device. You can control cookie settings through your browser preferences.
        </p>

        <h2>7. Your Rights</h2>
        <p>
          You have certain rights regarding your personal information, including:
        </p>
        <ul>
          <li><strong>Access:</strong> Request access to your personal information</li>
          <li><strong>Correction:</strong> Request correction of inaccurate information</li>
          <li><strong>Deletion:</strong> Request deletion of your personal information</li>
          <li><strong>Objection:</strong> Object to processing of your information</li>
          <li><strong>Data Portability:</strong> Request transfer of your information</li>
          <li><strong>Withdraw Consent:</strong> Withdraw consent for processing</li>
        </ul>

        <h2>8. Children&apos;s Privacy</h2>
        <p>
          Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us.
        </p>

        <h2>9. International Data Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
        </p>

        <h2>10. Retention of Information</h2>
        <p>
          We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
        </p>

        <h2>11. Third-Party Links</h2>
        <p>
          Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
        </p>

        <h2>12. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page with a new &ldquo;Last updated&rdquo; date.
        </p>

        <h2>13. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
        </p>
        <div>
          <p>
            <strong>Wamumbi Privacy Team</strong><br />
            Email: privacy@wamumbi.org<br />
            Phone: +254 123 456 789<br />
            Address: Nairobi, Kenya
          </p>
        </div>

        <h2>14. Consent</h2>
        <p>
          By using our website and services, you consent to the collection and use of your information as described in this Privacy Policy.
        </p>
      </div>
    </PageShell>
  )
}
