import type { Metadata } from "next"
import Link from "next/link"
import { PageShell } from "@/components/page-shell"
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF, LEGAL_UPDATED_LABEL, MPESA_TILL, legalProse } from "@/lib/legal"

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What personal information Wamumbi Foundation collects on this website, why, who it is shared with, and your rights under Kenya's Data Protection Act, 2019.",
}

export default function PrivacyPolicyPage() {
  return (
    <PageShell title="Privacy policy" intro={`Last updated ${LEGAL_UPDATED_LABEL}`} width="narrow">
      <div className={legalProse}>
        <p>
          This policy explains what personal information Wamumbi Foundation (&ldquo;Wamumbi&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) collects through this website, why we collect it, who we share it with, how long we keep it, and the rights you have under Kenya&rsquo;s <strong>Data Protection Act, 2019</strong>. We collect only what we need to run the foundation&rsquo;s work with orphaned and vulnerable children, and we never sell personal information.
        </p>

        <h2 id="who-we-are">1. Who we are</h2>
        <p>
          Wamumbi Foundation is a community charity based in Nairobi, Kenya. For the personal information described here, Wamumbi is the <strong>data controller</strong>. You can reach us about anything in this policy at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or <a href={CONTACT_PHONE_HREF}>{CONTACT_PHONE}</a>.
        </p>

        <h2 id="what-we-collect">2. What we collect, and why</h2>

        <h3>Your account</h3>
        <p>
          You need an account only to volunteer, register for events or work in the dashboard. Giving does not need an account. When you sign up we collect your email address, a username and password (or your Google, GitHub or Facebook sign-in), and, if you add them, your name and a profile photo. We use these to sign you in, show your name and photo in the dashboard, and record your role (for example Donor, Volunteer or Finance Manager) so you only see what that role allows.
        </p>

        <h3>Donations</h3>
        <p>
          Donations are made with M-Pesa to Buy Goods till <strong>{MPESA_TILL}</strong>. This website does not take card or M-Pesa payments directly and never sees your M-Pesa PIN. When our finance team records a gift, we store the amount, date, campaign, the M-Pesa transaction code and, unless you ask to give anonymously, your name and phone number. We use this to account for donations, thank you, and answer questions about a gift. Safaricom handles the payment itself under its own privacy terms.
        </p>

        <h3>Volunteer applications and partnership enquiries</h3>
        <p>
          The volunteer form asks for your name, email, phone, location, availability, skills, experience, why you want to volunteer and, optionally, an emergency contact. The partnership form asks for your organisation, contact person, email, phone and message. We use these answers only to review your application or enquiry and get back to you. If you give us an emergency contact, please tell them first.
        </p>

        <h3>Event registrations</h3>
        <p>
          When you register for an event we record which event, your account, any special requirements you tell us about and, for paid events, the M-Pesa transaction code.
        </p>

        <h3>Photos from our events</h3>
        <p>
          Our team uploads photos from outreach days and events. Every photo is reviewed before it is published on the website. <strong>We publish photos of children only where a parent or guardian has given consent</strong>, and we may blur faces where consent is not clear. If you, or a child in your care, appear in a photo you want removed, email us and we will take it down.
        </p>

        <h3>Technical information</h3>
        <p>
          Like any website, our hosting provider records basic technical details (such as IP address, browser type and the page requested) to deliver pages and keep the site secure. We use only the cookies needed to keep you signed in and remember your light or dark theme. We do not use advertising or tracking cookies, and our fonts are served from our own site rather than from third parties.
        </p>

        <h3>Activity in the dashboard</h3>
        <p>
          When staff and officials use the dashboard, we keep a log of important actions (such as role changes, approvals and recorded donations) with who did them and when. This protects donors and the foundation by keeping a clear record.
        </p>

        <h2 id="legal-basis">3. Our legal basis</h2>
        <p>We process personal information on these grounds under the Data Protection Act, 2019:</p>
        <ul>
          <li><strong>Your consent</strong>: for example when you submit a form, upload a photo, or accept this policy. You can withdraw consent at any time.</li>
          <li><strong>To provide what you asked for</strong>: running your account, your volunteer application or your event registration.</li>
          <li><strong>Legal obligations</strong>: keeping financial records of donations.</li>
          <li><strong>Our legitimate interests</strong>: keeping the website secure and the dashboard accountable, in a way that does not override your rights.</li>
        </ul>

        <h2 id="sharing">4. Who we share it with</h2>
        <p>
          Inside Wamumbi, people see only what their role needs: for example, the Finance Manager sees donation records and the Volunteer Coordinator sees volunteer applications. Outside Wamumbi, we use a small number of service providers who process data on our behalf and only on our instructions:
        </p>
        <ul>
          <li><strong>Clerk</strong>: sign-in and account management (email, name, profile photo, sign-in method).</li>
          <li><strong>Vercel</strong>: website hosting and storage of uploaded photos and posters.</li>
          <li><strong>Neon</strong>: the database that holds accounts, donations, applications and registrations.</li>
          <li><strong>Resend</strong>: sends us an email notification when a volunteer or partnership form is submitted.</li>
          <li><strong>Safaricom (M-Pesa)</strong>: processes M-Pesa payments you make to our till.</li>
        </ul>
        <p>
          We do not sell, rent or trade personal information, and we do not share it for advertising. We will disclose information to authorities only where the law requires it.
        </p>

        <h2 id="outside-kenya">5. Storage outside Kenya</h2>
        <p>
          Clerk, Vercel, Neon and Resend store data on servers outside Kenya, mainly in the United States. We use them because they apply strong security safeguards (encryption in transit and at rest, access controls and audited data centres). By using the website and accepting this policy, you consent to this transfer, as allowed under Part VI of the Data Protection Act, 2019.
        </p>

        <h2 id="security">6. How we protect it</h2>
        <ul>
          <li>All traffic to the website is encrypted (HTTPS).</li>
          <li>Passwords are handled by Clerk; we never see or store them.</li>
          <li>Dashboard access is limited by role, and only the Super Admin can change roles.</li>
          <li>Photos are reviewed before they go public.</li>
          <li>Important actions are recorded in an activity log.</li>
        </ul>
        <p>
          No system is perfectly secure. If a breach affects your personal information, we will notify the Office of the Data Protection Commissioner and, where required, you.
        </p>

        <h2 id="retention">7. How long we keep it</h2>
        <ul>
          <li><strong>Accounts</strong>: until you ask us to delete your account.</li>
          <li><strong>Donation records</strong>: for as long as Kenyan law requires us to keep financial records (generally seven years), then deleted or anonymised.</li>
          <li><strong>Volunteer applications and partnership enquiries</strong>: up to two years after we last hear from you, unless you become an active volunteer or partner.</li>
          <li><strong>Event photos</strong>: until you ask for removal or we no longer use them.</li>
          <li><strong>Activity logs</strong>: for as long as needed to keep the dashboard accountable.</li>
        </ul>

        <h2 id="your-rights">8. Your rights</h2>
        <p>Under the Data Protection Act, 2019 you have the right to:</p>
        <ul>
          <li>be told how your personal information is used (this policy);</li>
          <li>see the personal information we hold about you;</li>
          <li>object to all or part of how we use it;</li>
          <li>have wrong or misleading information corrected, and ask for information to be deleted;</li>
          <li>withdraw your consent at any time, without affecting what we did before; and</li>
          <li>receive your information in a common format to take elsewhere.</li>
        </ul>
        <p>
          You can update your name, email, photo and password yourself at <Link href="/profile">Your account</Link>. For anything else, including deleting your account, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We will reply within 30 days.
        </p>
        <p>
          If you are not happy with how we handle your information, you can complain to the <a href="https://www.odpc.go.ke" target="_blank" rel="noopener noreferrer">Office of the Data Protection Commissioner</a>. We would appreciate the chance to put things right first.
        </p>

        <h2 id="children">9. Children</h2>
        <p>
          Accounts on this website are for adults (18 and over). We do not knowingly collect personal information from children online. Information about the children in our programmes is handled by our team with the consent of their parent or guardian, and only in ways that protect the child&rsquo;s best interests.
        </p>

        <h2 id="changes">10. Changes to this policy</h2>
        <p>
          If we make significant changes, we will update the date at the top and ask signed-in users to review and accept the new version before continuing.
        </p>

        <h2 id="contact">11. Contact us</h2>
        <p>
          Wamumbi Foundation, Nairobi, Kenya
          <br />
          Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          <br />
          Phone: <a href={CONTACT_PHONE_HREF}>{CONTACT_PHONE}</a>
        </p>
        <p>
          See also our <Link href="/terms">Terms of use</Link>.
        </p>
      </div>
    </PageShell>
  )
}
