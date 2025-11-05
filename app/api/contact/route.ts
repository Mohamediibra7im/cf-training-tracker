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

    // Email content that you will receive - Modern Beautiful Design
    const emailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
          <tr>
            <td align="center">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center;">
                    <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border-radius: 12px; padding: 30px; border: 1px solid rgba(255,255,255,0.2);">
                      <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">
                        New Contact Form Submission
                      </h1>
                      <p style="margin: 12px 0 0 0; font-size: 16px; color: rgba(255,255,255,0.95); font-weight: 400;">
                        CF Training Tracker
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Contact Info Card -->
                <tr>
                  <td style="padding: 40px;">
                    <div style="background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%); border-radius: 12px; padding: 30px; border: 2px solid #e8eaff; margin-bottom: 24px; box-shadow: 0 4px 20px rgba(102, 126, 234, 0.1);">
                      <h2 style="margin: 0 0 24px 0; font-size: 20px; font-weight: 600; color: #1a1a2e; display: flex; align-items: center;">
                        <span style="display: inline-block; width: 4px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 2px; margin-right: 12px;"></span>
                        Contact Information
                      </h2>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="padding: 12px 0; font-weight: 600; color: #6b7280; width: 120px; font-size: 14px;">Name:</td>
                          <td style="padding: 12px 0; color: #1a1a2e; font-size: 15px; font-weight: 500;">${name}</td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; font-weight: 600; color: #6b7280; font-size: 14px;">Email:</td>
                          <td style="padding: 12px 0;">
                            <a href="mailto:${email}" style="color: #667eea; text-decoration: none; font-weight: 500; font-size: 15px; transition: color 0.2s;">${email}</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; font-weight: 600; color: #6b7280; font-size: 14px;">Category:</td>
                          <td style="padding: 12px 0;">
                            <span style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                              ${category.charAt(0).toUpperCase() + category.slice(1)}
                            </span>
                          </td>
                        </tr>
                      </table>
                    </div>

                    <!-- Subject Card -->
                    <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%); border-radius: 12px; padding: 30px; border: 2px solid #dcfce7; margin-bottom: 24px; box-shadow: 0 4px 20px rgba(34, 197, 94, 0.1);">
                      <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #1a1a2e; display: flex; align-items: center;">
                        <span style="display: inline-block; width: 4px; height: 24px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border-radius: 2px; margin-right: 12px;"></span>
                        Subject
                      </h2>
                      <p style="margin: 0; font-size: 16px; color: #1a1a2e; background: #ffffff; padding: 18px 20px; border-radius: 8px; border: 1px solid #e5e7eb; font-weight: 500; line-height: 1.6;">
                        ${subject}
                      </p>
                    </div>

                    <!-- Message Card -->
                    <div style="background: linear-gradient(135deg, #fff7ed 0%, #ffffff 100%); border-radius: 12px; padding: 30px; border: 2px solid #fed7aa; margin-bottom: 24px; box-shadow: 0 4px 20px rgba(249, 115, 22, 0.1);">
                      <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #1a1a2e; display: flex; align-items: center;">
                        <span style="display: inline-block; width: 4px; height: 24px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); border-radius: 2px; margin-right: 12px;"></span>
                        Message
                      </h2>
                      <div style="background: #ffffff; padding: 24px; border-radius: 10px; border: 1px solid #e5e7eb; white-space: pre-wrap; font-size: 15px; line-height: 1.8; color: #374151; font-weight: 400; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">
${message.replace(/\n/g, '<br>')}
                      </div>
                    </div>

                    <!-- Footer Info -->
                    <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; padding: 24px; border: 2px solid #86efac; text-align: center; box-shadow: 0 4px 20px rgba(34, 197, 94, 0.15);">
                      <div style="margin-bottom: 12px;">
                        <span style="display: inline-block; background: #22c55e; color: #ffffff; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);">
                          Received: ${new Date().toLocaleString()}
                        </span>
                      </div>
                      <p style="margin: 16px 0 0 0; font-size: 14px; color: #065f46; line-height: 1.6;">
                        <strong>Quick Reply:</strong> Click reply to respond directly to <strong style="color: #1a1a2e;">${name}</strong> at <a href="mailto:${email}" style="color: #667eea; text-decoration: none; font-weight: 600;">${email}</a>
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Bottom Spacer -->
                <tr>
                  <td style="padding: 0 40px 40px 40px; text-align: center;">
                    <p style="margin: 0; font-size: 12px; color: #9ca3af; line-height: 1.6;">
                      This email was sent from the CF Training Tracker contact form.<br>
                      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://cf-training-tracker.vercel.app'}" style="color: #667eea; text-decoration: none;">Visit Website</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
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

    // User Confirmation Email - Modern Beautiful Design
    const userConfirmationOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Thank you for contacting CF Training Tracker!',
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 20px;">
          <tr>
            <td align="center">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 50px 40px; text-align: center;">
                    <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border-radius: 12px; padding: 30px; border: 1px solid rgba(255,255,255,0.2);">
                      <div style="width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; border: 3px solid rgba(255,255,255,0.3);">
                        <div style="width: 40px; height: 40px; background: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                          <span style="font-size: 24px; color: #22c55e;">✓</span>
                        </div>
                      </div>
                      <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">
                        Message Received!
                      </h1>
                      <p style="margin: 12px 0 0 0; font-size: 16px; color: rgba(255,255,255,0.95); font-weight: 400;">
                        Thank you for reaching out to us
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Main Content -->
                <tr>
                  <td style="padding: 40px;">
                    <div style="text-align: center; margin-bottom: 32px;">
                      <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #1a1a2e;">
                        Hi ${name}!
                      </h2>
                      <p style="margin: 0; color: #6b7280; font-size: 16px; line-height: 1.7; max-width: 500px; margin: 0 auto;">
                        We have successfully received your message and will get back to you within <strong style="color: #1a1a2e;">24-48 hours</strong>.
                      </p>
                    </div>

                    <!-- Message Summary Card -->
                    <div style="background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%); border-radius: 12px; padding: 28px; border: 2px solid #bfdbfe; margin-bottom: 24px; box-shadow: 0 4px 20px rgba(59, 130, 246, 0.1);">
                      <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #1a1a2e; display: flex; align-items: center;">
                        <span style="display: inline-block; width: 4px; height: 20px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 2px; margin-right: 12px;"></span>
                        Your Message Summary
                      </h3>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="padding: 10px 0; font-weight: 600; color: #6b7280; font-size: 14px; width: 100px;">Subject:</td>
                          <td style="padding: 10px 0; color: #1a1a2e; font-size: 15px; font-weight: 500;">${subject}</td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0; font-weight: 600; color: #6b7280; font-size: 14px;">Category:</td>
                          <td style="padding: 10px 0;">
                            <span style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                              ${category.charAt(0).toUpperCase() + category.slice(1)}
                            </span>
                          </td>
                        </tr>
                      </table>
                    </div>

                    <!-- Quick Links Card -->
                    <div style="background: linear-gradient(135deg, #fff7ed 0%, #ffffff 100%); border-radius: 12px; padding: 28px; border: 2px solid #fed7aa; margin-bottom: 24px; box-shadow: 0 4px 20px rgba(249, 115, 22, 0.1);">
                      <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #1a1a2e; display: flex; align-items: center;">
                        <span style="display: inline-block; width: 4px; height: 20px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); border-radius: 2px; margin-right: 12px;"></span>
                        While You Wait, Check Out
                      </h3>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="padding: 12px 0;">
                            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://cf-training-tracker.vercel.app'}/help" style="display: block; background: #ffffff; color: #1a1a2e; text-decoration: none; padding: 14px 20px; border-radius: 8px; border: 2px solid #e5e7eb; font-weight: 500; font-size: 15px; margin-bottom: 8px; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                              📚 Help Center & FAQs
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0;">
                            <a href="https://github.com/Mohamediibra7im/cf-training-tracker" style="display: block; background: #ffffff; color: #1a1a2e; text-decoration: none; padding: 14px 20px; border-radius: 8px; border: 2px solid #e5e7eb; font-weight: 500; font-size: 15px; margin-bottom: 8px; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                              🐛 GitHub Issues & Discussions
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0;">
                            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://cf-training-tracker.vercel.app'}/training" style="display: block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 20px; border-radius: 8px; font-weight: 600; font-size: 15px; text-align: center; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                              🚀 Start Training
                            </a>
                          </td>
                        </tr>
                      </table>
                    </div>

                    <!-- Support Info -->
                    <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; padding: 24px; border: 2px solid #86efac; text-align: center; box-shadow: 0 4px 20px rgba(34, 197, 94, 0.1);">
                      <p style="margin: 0; font-size: 14px; color: #065f46; line-height: 1.7;">
                        <strong>Need urgent help?</strong><br>
                        Reply to this email or contact us directly at<br>
                        <a href="mailto:${process.env.SMTP_EMAIL}" style="color: #667eea; text-decoration: none; font-weight: 600; font-size: 15px;">${process.env.SMTP_EMAIL}</a>
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #1a1a2e; font-weight: 600;">
                      CF Training Tracker
                    </p>
                    <p style="margin: 0; font-size: 12px; color: #6b7280; line-height: 1.6;">
                      Thank you for being part of our community!<br>
                      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://cf-training-tracker.vercel.app'}" style="color: #667eea; text-decoration: none; font-weight: 500;">Visit Website</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
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
