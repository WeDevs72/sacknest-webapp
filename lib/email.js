/**
 * Create and configure nodemailer transporter
 * @returns {Object} - Nodemailer transporter instance
 */
function createTransporter() {
  // Check if SMTP is configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('SMTP configuration missing. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env file')
    return null
  }

  // Use require for nodemailer in Next.js API routes (CommonJS compatibility)
  const nodemailer = require('nodemailer')

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })

  return transport
}

/**
 * Send purchase confirmation email with download link
 * @param {Object} params - Email parameters
 * @param {string} params.customerEmail - Customer's email address
 * @param {string} params.customerName - Customer's name (optional)
 * @param {Object} params.order - Order details
 * @param {Object} params.pack - Premium pack details
 * @param {string} params.downloadUrl - URL to download page
 * @returns {Promise<Object>} - Nodemailer response
 */
export async function sendPurchaseConfirmationEmail({
  customerEmail,
  customerName = 'Valued Customer',
  order,
  pack,
  downloadUrl
}) {
  try {
    // Validate required fields
    if (!customerEmail || !order || !pack || !downloadUrl) {
      throw new Error('Missing required email parameters')
    }

    // Create transporter
    const transporter = createTransporter()
    if (!transporter) {
      return { error: 'Email service not configured' }
    }

    const currencySymbol = order.currency === 'INR' ? '₹' : '$'
    const amount = parseFloat(order.amount).toFixed(2)

    // Create email HTML
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your SackNest Purchase</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #facc15 0%, #f59e0b 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #000000; font-size: 32px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px;">
                ✨ SackNest
              </h1>
              <p style="margin: 10px 0 0; color: #000000; font-size: 16px; font-weight: 600;">
                Premium AI Prompt Library
              </p>
            </td>
          </tr>

          <!-- Success Message -->
          <tr>
            <td style="padding: 40px 30px; text-align: center; border-bottom: 2px solid #f3f4f6;">
              <div style="background-color: #10b981; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 48px; line-height: 1; align-self: center;">✓</span>
              </div>
              <h2 style="margin: 0 0 10px; color: #10b981; font-size: 28px; font-weight: 800;">
                Payment Successful! 🎉
              </h2>
              <p style="margin: 0; color: #6b7280; font-size: 16px; font-weight: 500;">
                Your premium content is ready to download
              </p>
            </td>
          </tr>

          <!-- Order Details -->
          <tr>
            <td style="padding: 30px;">
              <div style="background-color: #f9fafb; border: 2px solid #000000; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 16px; color: #000000; font-size: 18px; font-weight: 800; text-transform: uppercase;">
                  Order Details
                </h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Pack Name:</td>
                    <td style="padding: 8px 0; color: #000000; font-weight: 700; text-align: right;">${pack.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Order ID:</td>
                    <td style="padding: 8px 0; color: #000000; font-weight: 600; font-family: monospace; font-size: 12px; text-align: right;">${order.razorpayOrderId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Amount Paid:</td>
                    <td style="padding: 8px 0; color: #10b981; font-weight: 800; font-size: 18px; text-align: right;">${currencySymbol}${amount}</td>
                  </tr>
                </table>
              </div>

              <!-- Download Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${downloadUrl}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); color: #ffffff; text-decoration: none; padding: 18px 48px; border-radius: 12px; font-weight: 800; font-size: 18px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.3);">
                  📥 Download Your Prompts
                </a>
              </div>

              <!-- Pack Description -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 8px;">
                <p style="margin: 0; color: #92400e; font-weight: 600; font-size: 14px;">
                  <strong>What's included:</strong> ${pack.description || '50+ Premium AI Prompts curated for creators'}
                </p>
              </div>

              <!-- Important Info -->
              <div style="background-color: #eff6ff; border: 2px solid #3b82f6; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <h4 style="margin: 0 0 12px; color: #1e40af; font-size: 16px; font-weight: 800;">
                  📌 Important Information
                </h4>
                <ul style="margin: 0; padding-left: 20px; color: #1e40af; font-weight: 600; font-size: 14px; line-height: 1.8;">
                  <li>Your download link is valid for <strong>lifetime access</strong></li>
                  <li>Save this email to download your prompts anytime</li>
                  <li>You'll receive <strong>free updates</strong> when we add new prompts</li>
                  <li>Bookmark your download page for easy access</li>
                </ul>
              </div>

              <!-- Direct Link -->
              <div style="margin-top: 24px; padding-top: 24px; border-top: 2px solid #e5e7eb;">
                <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px; font-weight: 600;">
                  Can't click the button? Copy and paste this link:
                </p>
                <p style="margin: 0; word-break: break-all; color: #3b82f6; font-size: 12px; font-family: monospace; background-color: #f3f4f6; padding: 12px; border-radius: 6px;">
                  ${downloadUrl}
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #000000; padding: 30px; text-align: center; border-top: 4px solid #facc15;">
              <p style="margin: 0 0 16px; color: #ffffff; font-size: 18px; font-weight: 800;">
                🚀 Thank You for Your Purchase!
              </p>
              <p style="margin: 0 0 20px; color: #9ca3af; font-size: 14px; font-weight: 600;">
                Start creating amazing content with your new AI prompts
              </p>
              <p style="margin: 20px 0 0; color: #6b7280; font-size: 12px; font-weight: 600;">
                Need help? Contact us at <a href="mailto:support@sacknest.com" style="color: #facc15; text-decoration: none;">support@sacknest.com</a>
              </p>
              <p style="margin: 8px 0 0; color: #4b5563; font-size: 11px;">
                © ${new Date().getFullYear()} SackNest. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `

    // Plain text version
    const textContent = `
🎉 Payment Successful - SackNest Premium Pack

Thank you for your purchase!

ORDER DETAILS
--------------
Pack: ${pack.name}
Order ID: ${order.razorpayOrderId}
Amount Paid: ${currencySymbol}${amount}

DOWNLOAD YOUR PROMPTS
----------------------
Click here to download: ${downloadUrl}

Or copy and paste this link in your browser:
${downloadUrl}

WHAT'S INCLUDED
---------------
${pack.description || '50+ Premium AI Prompts curated for creators'}

IMPORTANT INFORMATION
---------------------
• Your download link has lifetime access
• Save this email to download your prompts anytime
• You'll receive free updates when we add new prompts
• Bookmark your download page for easy access

Need help? Contact us at support@sacknest.com

© 2025 SackNest. .
    `

    // Email options
    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL || `"SackNest" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `🎉 Your SackNest Premium Pack is Ready! - Order ${order.razorpayOrderId}`,
      html: htmlContent,
      text: textContent
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)

    console.log('Purchase confirmation email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }

  } catch (error) {
    console.error('Error sending purchase confirmation email:', error)
    return { error: error.message }
  }
}

/**
 * Check if email service is configured
 * @returns {boolean}
 */
export function isEmailConfigured() {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}
