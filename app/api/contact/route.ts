import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, subject, message, category } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Check if email configuration is available
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      console.error('Email configuration missing. Please set SMTP_EMAIL and SMTP_PASSWORD environment variables.');
      return NextResponse.json(
        {
          error: 'Email service is not configured. Please contact us directly.',
        },
        { status: 503 }
      );
    }

    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Email content that you will receive
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">📧 New Contact Form Submission</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">CF Training Tracker</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #667eea;">
            <h2 style="color: #333; margin: 0 0 15px 0; font-size: 20px;">👤 Contact Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555; width: 30%;">Name:</td>
                <td style="padding: 8px 0; color: #333;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                <td style="padding: 8px 0; color: #333;">
                  <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Category:</td>
                <td style="padding: 8px 0;">
                  <span style="background: #e3f2fd; color: #1976d2; padding: 4px 12px; border-radius: 15px; font-size: 12px; font-weight: bold;">
                    ${category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #4caf50;">
            <h2 style="color: #333; margin: 0 0 15px 0; font-size: 20px;">📝 Subject</h2>
            <p style="margin: 0; font-size: 16px; color: #333; background: #f5f5f5; padding: 15px; border-radius: 5px;">
              ${subject}
            </p>
          </div>

          <div style="background: white; padding: 25px; border-radius: 8px; border-left: 4px solid #ff9800;">
            <h2 style="color: #333; margin: 0 0 15px 0; font-size: 20px;">💬 Message</h2>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #333;">
${message}
            </div>
          </div>

          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-top: 20px; border: 1px solid #c8e6c9;">
            <p style="margin: 0; font-size: 14px; color: #2e7d32; text-align: center;">
              <strong>📅 Received:</strong> ${new Date().toLocaleString()}
            </p>
            <p style="margin: 10px 0 0 0; font-size: 12px; color: #666; text-align: center;">
              Click reply to respond directly to <strong>${name}</strong> at ${email}
            </p>
          </div>
        </div>
      </div>
    `;

    // Email options - the email you will receive
    const mailOptions = {
      from: `"${name}" <${email}>`, // Shows the user's name and email as sender
      to: process.env.SMTP_EMAIL, // Your email from .env file
      replyTo: email, // When you reply, it goes to the user's email
      subject: `[CF Training Tracker] ${category.toUpperCase()}: ${subject}`,
      html: emailContent,
    };

    // Send email to you
    await transporter.sendMail(mailOptions);

    // Optional: Send confirmation email to the user
    const userConfirmationOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Thank you for contacting CF Training Tracker! 🎯',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">✅ Message Received!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for reaching out</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="background: white; padding: 25px; border-radius: 8px; text-align: center;">
              <h2 style="color: #333; margin: 0 0 20px 0;">Hi ${name}! 👋</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                We have successfully received your message and will get back to you within <strong>24-48 hours</strong>.
              </p>
              
              <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3;">
                <h3 style="color: #1976d2; margin: 0 0 10px 0; font-size: 16px;">Your message summary:</h3>
                <p style="margin: 0; color: #555;"><strong>Subject:</strong> ${subject}</p>
                <p style="margin: 5px 0 0 0; color: #555;"><strong>Category:</strong> ${category.charAt(0).toUpperCase() + category.slice(1)}</p>
              </div>
              
              <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #f57c00; margin: 0 0 15px 0; font-size: 16px;">🚀 While you wait, check out:</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="margin: 8px 0;"><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/help" style="color: #1976d2; text-decoration: none;">📚 Help Center & FAQs</a></li>
                  <li style="margin: 8px 0;"><a href="https://github.com/Mohamediibra7im/cf-training-tracker" style="color: #1976d2; text-decoration: none;">🐛 GitHub Issues</a></li>
                  <li style="margin: 8px 0;"><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/training" style="color: #1976d2; text-decoration: none;">🏋️ Start Training</a></li>
                </ul>
              </div>
              
              <p style="color: #999; font-size: 14px; margin-top: 30px;">
                Need urgent help? Reply to this email or contact us directly at 
                <a href="mailto:${process.env.SMTP_EMAIL}" style="color: #1976d2;">${process.env.SMTP_EMAIL}</a>
              </p>
            </div>
          </div>
        </div>
      `,
    };

    // Send confirmation email to user
    await transporter.sendMail(userConfirmationOptions);

    return NextResponse.json(
      {
        message: 'Email sent successfully! You will receive a confirmation email shortly.',
        success: true
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      {
        error: 'Failed to send email. Please try again later or contact us directly.',
        success: false
      },
      { status: 500 }
    );
  }
}
