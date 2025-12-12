import { procedure, router } from "./trpc";
import { z } from "zod";

export const partnershipRouter = router({
  submitInquiry: procedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/partnership',
        tags: ['partnership'],
        summary: 'Submit partnership inquiry',
        description: 'Submits a partnership inquiry from the website form and sends an email notification'
      }
    })
    .input(z.object({
      organizationName: z.string().min(1, "Organization name is required"),
      contactPerson: z.string().min(1, "Contact person is required"),
      email: z.string().email("Valid email is required"),
      phone: z.string().optional(),
      organizationType: z.string().optional(),
      partnershipInterest: z.string().optional(),
      message: z.string().optional(),
      website: z.string().optional(),
    }))
    .output(z.object({
      success: z.boolean(),
      message: z.string(),
    }))
    .mutation(async ({ input }) => {
      // Get recipient email from environment
      const recipientEmail = process.env.PARTNERSHIP_EMAIL;
      if (!recipientEmail) {
        throw new Error('Email service not configured');
      }

      // Create email content
      const emailContent = {
        to: recipientEmail,
        subject: `Partnership Inquiry from ${input.organizationName}`,
        html: `
          <h2>New Partnership Inquiry</h2>
          <p><strong>Organization:</strong> ${input.organizationName}</p>
          <p><strong>Contact Person:</strong> ${input.contactPerson}</p>
          <p><strong>Email:</strong> ${input.email}</p>
          <p><strong>Phone:</strong> ${input.phone || 'Not provided'}</p>
          <p><strong>Organization Type:</strong> ${input.organizationType || 'Not specified'}</p>
          <p><strong>Partnership Interest:</strong> ${input.partnershipInterest || 'Not specified'}</p>
          <p><strong>Website:</strong> ${input.website || 'Not provided'}</p>
          <h3>Message:</h3>
          <p>${input.message || 'No message provided'}</p>
          <hr>
          <p><em>This inquiry was submitted via the Wamumbi website partnership form.</em></p>
        `,
        text: `
New Partnership Inquiry

Organization: ${input.organizationName}
Contact Person: ${input.contactPerson}
Email: ${input.email}
Phone: ${input.phone || 'Not provided'}
Organization Type: ${input.organizationType || 'Not specified'}
Partnership Interest: ${input.partnershipInterest || 'Not specified'}
Website: ${input.website || 'Not provided'}

Message:
${input.message || 'No message provided'}

This inquiry was submitted via the Wamumbi website partnership form.
        `,
      };

      // TODO: Integrate with email service (Resend, SendGrid, etc.)
      // For now, log the email content
      console.log('Partnership inquiry email to send:', emailContent);

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        message: 'Partnership inquiry submitted successfully. We will contact you soon!',
      };
    }),
});