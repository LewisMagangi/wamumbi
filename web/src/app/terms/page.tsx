import type { Metadata } from "next"
import { PageShell } from "@/components/page-shell"

export const metadata: Metadata = { title: "Terms of use", description: "The terms for using Wamumbi Foundation's website and services." }

// Prose styles for headings, paragraphs and lists, without a typography plugin.
const prose =
  "max-w-none text-foreground/85 leading-relaxed [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-foreground [&_h3]:mt-8 [&_h3]:font-sans [&_h3]:text-base [&_h3]:font-medium [&_h3]:text-foreground [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 [&_a]:underline [&_a]:underline-offset-4 [&_strong]:text-foreground"

export default function TermsPage() {
  return (
    <PageShell title="Terms of use" intro="Last updated 11 November 2026" width="narrow">
      <div className={prose}>
        <h2>1. Introduction</h2>
        <p>
          Welcome to Wamumbi. These Terms and Conditions govern your use of our website and services. By accessing or using our website, you agree to be bound by these Terms.
        </p>

        <h2>2. Definitions</h2>
        <p>
          <strong>&ldquo;Organization,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo;</strong> and <strong>&ldquo;our&rdquo;</strong> refer to Wamumbi.<br />
          <strong>&ldquo;User,&rdquo; &ldquo;you,&rdquo;</strong> and <strong>&ldquo;your&rdquo;</strong> refer to individuals accessing or using our services.<br />
          <strong>&ldquo;Services&rdquo;</strong> refers to all features, content, and services provided through our website.
        </p>

        <h2>3. Use of Services</h2>
        <p>
          You may use our services only for lawful purposes and in accordance with these Terms. You agree not to use our services:
        </p>
        <ul>
          <li>In any way that violates any applicable national or international law or regulation</li>
          <li>To transmit any unsolicited or unauthorized advertising or promotional material</li>
          <li>To impersonate or attempt to impersonate the Organization or another user</li>
          <li>In any way that could disable, overburden, or impair the website</li>
        </ul>

        <h2>4. Donations</h2>
        <p>
          All donations made through our website are voluntary and non-refundable except as required by law. We reserve the right to refuse or return any donation at our discretion. Donors will receive acknowledgment of their donations for tax purposes where applicable.
        </p>

        <h2>5. Volunteer Services</h2>
        <p>
          Volunteers must comply with all organization policies and procedures. We reserve the right to reject any volunteer application or terminate volunteer services at any time. Background checks may be required for certain volunteer positions.
        </p>

        <h2>6. Intellectual Property</h2>
        <p>
          The website and its entire contents, features, and functionality are owned by Wamumbi and are protected by international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written permission.
        </p>

        <h2>7. User Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must notify us immediately of any unauthorized use of your account.
        </p>

        <h2>8. Privacy</h2>
        <p>
          Your use of our services is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding the collection and use of your information.
        </p>

        <h2>9. Disclaimer of Warranties</h2>
        <p>
          Our services are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, either express or implied. We do not warrant that our services will be uninterrupted, secure, or error-free.
        </p>

        <h2>10. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, Wamumbi shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of our services.
        </p>

        <h2>11. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page with a new &ldquo;Last updated&rdquo; date. Your continued use of our services after such changes constitutes acceptance of the modified Terms.
        </p>

        <h2>12. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of Kenya, without regard to its conflict of law provisions.
        </p>

        <h2>13. Contact Information</h2>
        <p>
          If you have any questions about these Terms, please contact us at:
        </p>
        <div>
          <p>
            <strong>Wamumbi</strong><br />
            Email: legal@wamumbi.org<br />
            Phone: +254 123 456 789<br />
            Address: Nairobi, Kenya
          </p>
        </div>

        <h2>14. Acceptance of Terms</h2>
        <p>
          By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
        </p>
      </div>
    </PageShell>
  )
}
