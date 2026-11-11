import type { Metadata } from "next"
import Link from "next/link"
import { PageShell } from "@/components/page-shell"
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF, LEGAL_UPDATED_LABEL, MPESA_TILL, legalProse } from "@/lib/legal"

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The rules for using the Wamumbi Foundation website and dashboard: accounts, donations by M-Pesa, volunteering, events, photos and conduct.",
}

export default function TermsPage() {
  return (
    <PageShell title="Terms of use" intro={`Last updated ${LEGAL_UPDATED_LABEL}`} width="narrow">
      <div className={legalProse}>
        <p>
          These terms apply to the Wamumbi Foundation website, including the signed-in dashboard (together, &ldquo;the website&rdquo;). By creating an account, signing in, or submitting a form, you agree to these terms and to our <Link href="/privacy">Privacy policy</Link>. If you do not agree, please do not use the website.
        </p>

        <h2 id="about">1. About us</h2>
        <p>
          The website is run by Wamumbi Foundation (&ldquo;Wamumbi&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), a community charity in Nairobi, Kenya, that supports orphaned and vulnerable children and their guardians through outreach, education and care.
        </p>

        <h2 id="accounts">2. Your account</h2>
        <ul>
          <li>You must be <strong>18 or older</strong> to create an account.</li>
          <li>Give accurate details and keep them up to date at <Link href="/profile">Your account</Link>.</li>
          <li>Keep your password private and do not share your account. You are responsible for what happens under it. Tell us straight away if you think someone else has used it.</li>
          <li>New accounts start with the <strong>Donor</strong> role. Other roles (such as Volunteer, Finance Manager or Event Coordinator) are given by the Super Admin and can be changed or removed at any time.</li>
          <li>We may suspend or close an account that breaks these terms or puts children, donors or the foundation at risk.</li>
          <li>Accounts with no activity for a year are flagged as inactive, and we may archive them. An archived account cannot open the dashboard until it is restored; email us and we will restore it. We may delete accounts that have been archived for a long time, as explained in our <Link href="/privacy#retention">Privacy policy</Link>.</li>
          <li>You can ask us to close your account at any time by emailing <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</li>
        </ul>

        <h2 id="donations">3. Donations</h2>
        <ul>
          <li>Donations are made with M-Pesa to Buy Goods till <strong>{MPESA_TILL}</strong>. You do not need an account to give.</li>
          <li>Always check that the till name shown on your phone is Wamumbi Foundation before you confirm. We will never ask for your M-Pesa PIN, and only ever ask you to pay to till {MPESA_TILL}.</li>
          <li>Gifts are voluntary and generally cannot be refunded. If you made a mistake (for example the wrong amount), contact us within 14 days with your M-Pesa code and we will do our best to help.</li>
          <li>Gifts given to a campaign go to that campaign. If a campaign is fully funded or cannot go ahead, we may use the gift where the need is greatest.</li>
          <li>Our finance team records each gift with its M-Pesa code. If you ask, we will record it as anonymous.</li>
        </ul>

        <h2 id="volunteering">4. Volunteering and events</h2>
        <ul>
          <li>Applying to volunteer does not guarantee a place. We may ask for references or, for roles working with children, a certificate of good conduct.</li>
          <li>Volunteers must follow our safeguarding rules and the instructions of the team leader on the day.</li>
          <li>Event places may be limited. For paid events, your place is confirmed once your M-Pesa payment is recorded. If we cancel a paid event, we will refund you or offer a place at another event.</li>
          <li>Taking part in outreach and events is at your own risk to the extent the law allows. Tell us in advance about any special requirements.</li>
        </ul>

        <h2 id="children">5. Protecting children</h2>
        <p>
          The safety and dignity of the children we serve comes first. Anyone using the website, and especially anyone with dashboard access, must:
        </p>
        <ul>
          <li>upload photos of children only where a parent or guardian has given consent, and confirm this when uploading;</li>
          <li>never share children&rsquo;s names, locations, schools or photos outside the website or the foundation&rsquo;s official channels;</li>
          <li>never contact a child through the website or use information from it to contact a child privately.</li>
        </ul>
        <p>Breaking these rules will lead to your access being removed and may be reported to the authorities.</p>

        <h2 id="photos">6. Photos and videos at our events</h2>
        <ul>
          <li><strong>Consent to be photographed.</strong> Our team, and photographers we appoint, take photos and videos at Wamumbi events. By attending, you agree that we may take photos and videos in which you appear and publish them on this website, our social media pages and our printed materials, to tell the story of the foundation&rsquo;s work. If you prefer not to be photographed, tell the event lead on the day; to have a published photo of you taken down, email us.</li>
          <li><strong>Children.</strong> We photograph and publish children only with the consent of a parent or guardian, as set out in section 5 and our <Link href="/privacy#what-we-collect">Privacy policy</Link>.</li>
          <li><strong>Who owns the photos.</strong> Photos and videos taken at our events by our team or by photographers we appoint belong to Wamumbi Foundation. You may share them on your personal social media to support the foundation, but not for commercial use or in a way that suggests you speak for Wamumbi.</li>
          <li><strong>Photos you take yourself.</strong> You keep the rights to photos you take at our events, but by sharing them with us (for example by uploading them to the website) you allow Wamumbi to publish them for the foundation&rsquo;s work.</li>
          <li><strong>Posting responsibly.</strong> Do not post photos or videos from our events, whether ours or your own, that are inappropriate, embarrassing to the people in them, misleading, or that could harm the reputation of Wamumbi Foundation, our partners or the children we serve. Never post photos of children from our events except those we have published ourselves.</li>
          <li><strong>Takedown requests.</strong> If we ask you to remove such a photo or video from your social media or anywhere else you have posted it, you agree to remove it promptly, and in any case within 48 hours of our request.</li>
        </ul>

        <h2 id="dashboard">7. Using the dashboard</h2>
        <p>If you have a role that gives you dashboard access, you also agree to:</p>
        <ul>
          <li>use donor, volunteer and partner information only for the foundation&rsquo;s work, and keep it inside the dashboard;</li>
          <li>delete exported files (such as donation CSVs) once you are done with them;</li>
          <li>record donations and other information accurately and honestly;</li>
          <li>not try to access areas or information your role does not allow.</li>
        </ul>
        <p>Important actions in the dashboard are recorded in an activity log.</p>

        <h2 id="content">8. What you post</h2>
        <p>
          When you upload photos or submit content (such as campaign or event details), you confirm you have the right to share it and the consent of the people in it, and you give Wamumbi permission to publish it on the website and our official channels for the foundation&rsquo;s work. Content is reviewed before it goes live, and we may edit, decline or remove anything at our discretion. You must not upload anything unlawful, offensive, misleading or that invades someone&rsquo;s privacy.
        </p>

        <h2 id="acceptable-use">9. Acceptable use</h2>
        <p>Do not:</p>
        <ul>
          <li>use the website for fraud, including pretending to collect donations for Wamumbi through any other till, account or link;</li>
          <li>try to break, overload or get around the website&rsquo;s security, or access other people&rsquo;s accounts;</li>
          <li>submit spam or automated form entries;</li>
          <li>copy our name, logo or content to suggest you represent Wamumbi without our written permission.</li>
        </ul>

        <h2 id="ip">10. Our content</h2>
        <p>
          The Wamumbi name, logo, text and photos on the website belong to Wamumbi Foundation or the people who allowed us to use them. You may share links and our flyer to support the foundation, but please do not use our content for anything else without permission.
        </p>

        <h2 id="liability">11. Our responsibility</h2>
        <p>
          We work hard to keep the website accurate and available, but it is provided &ldquo;as is&rdquo; and may sometimes be unavailable or contain mistakes. To the extent the law allows, Wamumbi is not liable for indirect losses, or for losses caused by events outside our control, by third-party services (such as M-Pesa), or by misuse of your account. Nothing in these terms limits rights you have under Kenyan law that cannot be limited.
        </p>

        <h2 id="changes">12. Changes to these terms</h2>
        <p>
          We may update these terms. If we make significant changes, we will update the date at the top and ask signed-in users to review and accept the new version before continuing.
        </p>

        <h2 id="law">13. Governing law</h2>
        <p>
          These terms are governed by the laws of Kenya. We will always try to resolve concerns with you directly first; any dispute that cannot be resolved will be handled by the courts of Kenya.
        </p>

        <h2 id="contact">14. Contact us</h2>
        <p>
          Wamumbi Foundation, Nairobi, Kenya
          <br />
          Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          <br />
          Phone: <a href={CONTACT_PHONE_HREF}>{CONTACT_PHONE}</a>
        </p>
      </div>
    </PageShell>
  )
}
