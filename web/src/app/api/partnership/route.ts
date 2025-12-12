import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      organizationName,
      contactPerson,
      email,
      phone,
      organizationType,
      partnershipInterest,
      message,
      website,
    } = body;

    // Validate required fields
    if (!organizationName || !contactPerson || !email) {
      return NextResponse.json(
        { error: 'Organization name, contact person, and email are required' },
        { status: 400 }
      );
    }

    // Get recipient email from environment
    const recipientEmail = process.env.PARTNERSHIP_EMAIL;
    if (!recipientEmail) {
      console.error('PARTNERSHIP_EMAIL environment variable not set');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Create email content
    const emailContent = {
      to: recipientEmail,
      subject: `Partnership Inquiry from ${organizationName}`,
      html: `
        <h2>New Partnership Inquiry</h2>
        <p><strong>Organization:</strong> ${organizationName}</p>
        <p><strong>Contact Person:</strong> ${contactPerson}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Organization Type:</strong> ${organizationType || 'Not specified'}</p>
        <p><strong>Partnership Interest:</strong> ${partnershipInterest || 'Not specified'}</p>
        <p><strong>Website:</strong> ${website || 'Not provided'}</p>
        <h3>Message:</h3>
        <p>${message || 'No message provided'}</p>
        <hr>
        <p><em>This inquiry was submitted via the Wamumbi website partnership form.</em></p>
      `,
      text: `
New Partnership Inquiry

Organization: ${organizationName}
Contact Person: ${contactPerson}
Email: ${email}
Phone: ${phone || 'Not provided'}
Organization Type: ${organizationType || 'Not specified'}
Partnership Interest: ${partnershipInterest || 'Not specified'}
Website: ${website || 'Not provided'}

Message:
${message || 'No message provided'}

This inquiry was submitted via the Wamumbi website partnership form.
      `,
    };

    // TODO: Integrate with email service (Resend, SendGrid, etc.)
    // For now, log the email content
    console.log('Partnership inquiry email to send:', emailContent);

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: 'Partnership inquiry submitted successfully. We will contact you soon!',
    });

  } catch (error) {
    console.error('Error processing partnership inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to process partnership inquiry' },
      { status: 500 }
    );
  }
}