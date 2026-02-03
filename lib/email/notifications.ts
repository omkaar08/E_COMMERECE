import { Resend } from 'resend'
import { formatPrice } from '@/lib/utils/product'

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@yourdomain.com'

// Lazy instantiation to avoid build-time errors
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not defined in environment variables')
  }
  return new Resend(apiKey)
}

interface OrderEmailData {
  customerName: string
  customerEmail: string
  orderNumber: string
  orderDate: string
  totalAmount: number
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  shippingAddress: {
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

interface ShipmentEmailData {
  customerName: string
  customerEmail: string
  orderNumber: string
  courierName: string
  trackingId: string
  trackingUrl?: string
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  try {
    const itemsHtml = data.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatPrice(item.price)}</td>
        </tr>
      `
      )
      .join('')

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #10b981; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">✓ Order Confirmed!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Thank you for your order</p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="font-size: 16px; margin-top: 0;">Hi ${data.customerName},</p>
            <p style="font-size: 16px;">Your order has been confirmed and will be processed soon.</p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #1f2937;">Order Details</h2>
              <table style="width: 100%; font-size: 14px;">
                <tr>
                  <td style="padding: 8px 0;"><strong>Order Number:</strong></td>
                  <td style="padding: 8px 0; text-align: right;">${data.orderNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Order Date:</strong></td>
                  <td style="padding: 8px 0; text-align: right;">${data.orderDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Total Amount:</strong></td>
                  <td style="padding: 8px 0; text-align: right; color: #2563eb; font-size: 18px; font-weight: bold;">${formatPrice(data.totalAmount)}</td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #1f2937;">Order Items</h2>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <thead>
                  <tr style="background-color: #f3f4f6;">
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Item</th>
                    <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
            </div>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #1f2937;">Shipping Address</h2>
              <p style="margin: 5px 0; font-size: 14px;">${data.customerName}</p>
              <p style="margin: 5px 0; font-size: 14px;">${data.shippingAddress.line1}</p>
              ${data.shippingAddress.line2 ? `<p style="margin: 5px 0; font-size: 14px;">${data.shippingAddress.line2}</p>` : ''}
              <p style="margin: 5px 0; font-size: 14px;">${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}</p>
              <p style="margin: 5px 0; font-size: 14px;">${data.shippingAddress.country}</p>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
              You can track your order status by logging into your account on our website.
            </p>
            
            <p style="font-size: 14px; color: #6b7280;">
              If you have any questions, please don't hesitate to contact us.
            </p>
          </div>
          
          <div style="background-color: #1f2937; color: #d1d5db; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
            <p style="margin: 5px 0;">© 2026 NutSphere. All rights reserved.</p>
            <p style="margin: 5px 0;">H.NO 84, Shivkalyan Nagar Loha, Dist-Nanded 431708</p>
            <p style="margin: 5px 0;">Phone: +91 87665 00291 | Email: Hello@nutsphere.com</p>
            <p style="margin: 10px 0 5px 0;">This is an automated email. Please do not reply.</p>
          </div>
        </body>
      </html>
    `

    const resend = getResendClient()
    const { data: emailResult, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Order Confirmation - ${data.orderNumber}`,
      html,
    })

    if (error) {
      console.error('Failed to send order confirmation email:', error)
      return { success: false, error }
    }

    return { success: true, data: emailResult }
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    return { success: false, error }
  }
}

export async function sendOrderShippedEmail(data: ShipmentEmailData) {
  try {
    const trackingButton = data.trackingUrl
      ? `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.trackingUrl}" 
             style="display: inline-block; background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Track Your Order
          </a>
        </div>
      `
      : ''

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #3b82f6; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">📦 Your Order is on the Way!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Your package has been shipped</p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="font-size: 16px; margin-top: 0;">Hi ${data.customerName},</p>
            <p style="font-size: 16px;">Great news! Your order has been shipped and is on its way to you.</p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #1f2937;">Shipment Details</h2>
              <table style="width: 100%; font-size: 14px;">
                <tr>
                  <td style="padding: 8px 0;"><strong>Order Number:</strong></td>
                  <td style="padding: 8px 0; text-align: right;">${data.orderNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Courier:</strong></td>
                  <td style="padding: 8px 0; text-align: right;">${data.courierName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Tracking ID:</strong></td>
                  <td style="padding: 8px 0; text-align: right; font-family: monospace; font-weight: bold;">${data.trackingId}</td>
                </tr>
              </table>
            </div>
            
            ${trackingButton}
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
              You can use the tracking ID above to check the delivery status on the courier's website.
            </p>
            
            <p style="font-size: 14px; color: #6b7280;">
              If you have any questions about your delivery, please contact us.
            </p>
          </div>
          
          <div style="background-color: #1f2937; color: #d1d5db; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
            <p style="margin: 5px 0;">© 2026 NutSphere. All rights reserved.</p>
            <p style="margin: 5px 0;">H.NO 84, Shivkalyan Nagar Loha, Dist-Nanded 431708</p>
            <p style="margin: 5px 0;">Phone: +91 87665 00291 | Email: Hello@nutsphere.com</p>
            <p style="margin: 10px 0 5px 0;">This is an automated email. Please do not reply.</p>
          </div>
        </body>
      </html>
    `

    const resend = getResendClient()
    const { data: emailResult, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Your Order Has Been Shipped - ${data.orderNumber}`,
      html,
    })

    if (error) {
      console.error('Failed to send shipment email:', error)
      return { success: false, error }
    }

    return { success: true, data: emailResult }
  } catch (error) {
    console.error('Error sending shipment email:', error)
    return { success: false, error }
  }
}

export async function sendOrderDeliveredEmail(
  customerName: string,
  customerEmail: string,
  orderNumber: string
) {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #10b981; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">✨ Order Delivered!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Your package has been delivered</p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="font-size: 16px; margin-top: 0;">Hi ${customerName},</p>
            <p style="font-size: 16px;">Your order <strong>${orderNumber}</strong> has been successfully delivered!</p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="font-size: 18px; color: #10b981; margin: 0;">🎉 We hope you love your purchase! 🎉</p>
            </div>
            
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <p style="font-size: 14px; color: #92400e; margin: 0; font-weight: bold;">⚠️ Important: Quality Check</p>
              <p style="font-size: 14px; color: #92400e; margin: 10px 0 0 0;">
                Please inspect your products immediately upon delivery. We only offer refunds for defective or damaged products. 
                If you find any issues, contact us within 24 hours with photos.
              </p>
            </div>
            
            <p style="font-size: 14px; color: #6b7280;">
              If you have any issues with your order or need assistance, please contact us at:
            </p>
            
            <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p style="font-size: 14px; margin: 5px 0;">📞 Phone: <a href="tel:+918766500291" style="color: #2563eb; text-decoration: none;">+91 87665 00291</a></p>
              <p style="font-size: 14px; margin: 5px 0;">✉️ Email: <a href="mailto:Hello@nutsphere.com" style="color: #2563eb; text-decoration: none;">Hello@nutsphere.com</a></p>
            </div>
            
            <p style="font-size: 14px; color: #6b7280;">
              Thank you for shopping with NutSphere!
            </p>
          </div>
          
          <div style="background-color: #1f2937; color: #d1d5db; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
            <p style="margin: 5px 0;">© 2026 NutSphere. All rights reserved.</p>
            <p style="margin: 5px 0;">H.NO 84, Shivkalyan Nagar Loha, Dist-Nanded 431708</p>
            <p style="margin: 5px 0;">Phone: +91 87665 00291 | Email: Hello@nutsphere.com</p>
            <p style="margin: 10px 0 5px 0;">This is an automated email. Please do not reply.</p>
          </div>
        </body>
      </html>
    `

    const resend = getResendClient()
    const { data: emailResult, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `Order Delivered - ${orderNumber}`,
      html,
    })

    if (error) {
      console.error('Failed to send delivery email:', error)
      return { success: false, error }
    }

    return { success: true, data: emailResult }
  } catch (error) {
    console.error('Error sending delivery email:', error)
    return { success: false, error }
  }
}
