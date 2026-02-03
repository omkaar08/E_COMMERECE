import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function GET() {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    // Use Resend's onboarding email for testing (works without domain verification)
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'omkarmahajan339@gmail.com',
      subject: '✅ Test Email - Resend Integration Working!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #10b981; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">✅ Resend Working!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Email Integration Test Successful</p>
            </div>
            
            <div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <p style="font-size: 16px; margin-top: 0;">Hi Omkar! 👋</p>
              <p style="font-size: 16px;">Great news! Your Resend integration is working perfectly. This test email confirms that:</p>
              
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                <h2 style="margin-top: 0; color: #1f2937;">✅ Connection Status</h2>
                <ul style="font-size: 14px; line-height: 1.8; margin: 10px 0;">
                  <li>✓ Resend API Key: Valid</li>
                  <li>✓ Email Service: Connected</li>
                  <li>✓ Test Email: Delivered</li>
                  <li>✓ Timestamp: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} IST</li>
                </ul>
              </div>
              
              <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
                <h3 style="margin-top: 0; color: #1f2937;">📧 Next Steps</h3>
                <p style="font-size: 14px; margin-bottom: 10px;"><strong>To use your custom domain (orders@send.nutsphere.com):</strong></p>
                <ol style="font-size: 14px; line-height: 1.8;">
                  <li>Go to <a href="https://resend.com/domains" style="color: #3b82f6;">Resend Domains</a></li>
                  <li>Verify your domain: <strong>send.nutsphere.com</strong></li>
                  <li>Add the DNS records provided by Resend</li>
                  <li>Wait for verification (usually takes a few minutes)</li>
                </ol>
                <p style="font-size: 13px; color: #6b7280; margin-top: 15px;">
                  Note: This test uses onboarding@resend.dev (works without verification). Once your domain is verified, all customer emails will come from orders@send.nutsphere.com
                </p>
              </div>
              
              <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <h3 style="margin-top: 0; color: #1f2937;">📋 Current Configuration</h3>
                <table style="width: 100%; font-size: 13px;">
                  <tr>
                    <td style="padding: 5px 0;"><strong>API Key:</strong></td>
                    <td style="padding: 5px 0;">re_azSDsxsz...r3Lbn (Valid ✓)</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0;"><strong>From Email:</strong></td>
                    <td style="padding: 5px 0;">orders@send.nutsphere.com</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0;"><strong>Domain Status:</strong></td>
                    <td style="padding: 5px 0; color: #d97706;">⚠️ Needs Verification</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0;"><strong>Test Mode:</strong></td>
                    <td style="padding: 5px 0; color: #10b981;">✓ Working (using onboarding@resend.dev)</td>
                  </tr>
                </table>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #6b7280;">
                <p>Test Email from NutSphere E-commerce</p>
                <p style="margin-top: 10px;">
                  <a href="http://localhost:3000" style="color: #10b981; text-decoration: none;">Visit Store</a> | 
                  <a href="http://localhost:3000/admin" style="color: #10b981; text-decoration: none;">Admin Panel</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          details: error 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '✅ Test email sent successfully to omkarmahajan339@gmail.com!',
      note: 'This test uses onboarding@resend.dev. To use your custom domain, verify send.nutsphere.com in Resend dashboard.',
      data: data,
      emailDetails: {
        to: 'omkarmahajan339@gmail.com',
        from: 'onboarding@resend.dev',
        customDomain: 'orders@send.nutsphere.com (needs verification)',
        timestamp: new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.error('Error sending test email:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to send test email',
        details: error
      },
      { status: 500 }
    )
  }
}
