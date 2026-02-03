import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@yourdomain.com'

export async function GET() {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: 'omkarmahajan339@gmail.com',
      subject: 'Test Email from NutSphere - Resend Integration Test',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #10b981; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">✓ Resend Integration Test</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Email system is working!</p>
            </div>
            
            <div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <p style="font-size: 16px; margin-top: 0;">Hello Omkar,</p>
              <p style="font-size: 16px;">This is a test email to confirm that Resend email integration is working correctly for your NutSphere e-commerce store.</p>
              
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                <h2 style="margin-top: 0; color: #1f2937;">✅ Test Results</h2>
                <ul style="font-size: 14px; line-height: 1.8;">
                  <li><strong>Resend API:</strong> Connected successfully</li>
                  <li><strong>From Email:</strong> ${FROM_EMAIL}</li>
                  <li><strong>To Email:</strong> omkarmahajan339@gmail.com</li>
                  <li><strong>Status:</strong> Email delivered</li>
                  <li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
                </ul>
              </div>
              
              <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
                <h3 style="margin-top: 0; color: #1f2937;">📧 Email Features Ready</h3>
                <p style="font-size: 14px; margin-bottom: 10px;">Your store can now send:</p>
                <ul style="font-size: 14px; line-height: 1.8;">
                  <li>Order confirmation emails</li>
                  <li>Order shipped notifications</li>
                  <li>Order delivered confirmations</li>
                  <li>Custom email notifications</li>
                </ul>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #6b7280;">
                <p>This is a test email from NutSphere E-commerce Store</p>
                <p style="margin-top: 10px;">
                  <a href="http://localhost:3000" style="color: #10b981; text-decoration: none;">Visit Store</a> | 
                  <a href="http://localhost:3000/admin" style="color: #10b981; text-decoration: none;">Admin Dashboard</a>
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
      message: 'Test email sent successfully!',
      data: data,
      to: 'omkarmahajan339@gmail.com',
      from: FROM_EMAIL,
      timestamp: new Date().toISOString()
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
