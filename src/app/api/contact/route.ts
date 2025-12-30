import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(2000),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = contactSchema.parse(body)
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Email to restaurant
    const restaurantEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Neue Kontaktanfrage - Efsane Gasthaus Rudolph</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1B4332;">Neue Kontaktanfrage</h2>
          <p><strong>Name:</strong> ${validatedData.name}</p>
          <p><strong>E-Mail:</strong> ${validatedData.email}</p>
          ${validatedData.phone ? `<p><strong>Telefon:</strong> ${validatedData.phone}</p>` : ''}
          <p><strong>Betreff:</strong> ${validatedData.subject}</p>
          <p><strong>Nachricht:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #1B4332; margin: 10px 0;">
            ${validatedData.message.replace(/\n/g, '<br>')}
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            Gesendet am: ${new Date().toLocaleString('de-DE')}
          </p>
        </div>
      </body>
      </html>
    `

    // Confirmation email to customer
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Bestätigung Ihrer Nachricht - Efsane Gasthaus Rudolph</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1B4332;">Vielen Dank für Ihre Nachricht!</h2>
          <p>Liebe/r ${validatedData.name},</p>
          <p>vielen Dank für Ihre Nachricht an das Efsane Gasthaus Rudolph. Wir haben Ihre Anfrage erhalten und werden uns schnellstmöglich bei Ihnen melden.</p>
          
          <div style="background: #fff8dc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1B4332; margin-top: 0;">Ihre Nachricht:</h3>
            <p><strong>Betreff:</strong> ${validatedData.subject}</p>
            <p><strong>Nachricht:</strong></p>
            <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #FFD60A;">
              ${validatedData.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <p>Bei Fragen erreichen Sie uns auch telefonisch unter <strong>06196 23640</strong> oder per E-Mail an <strong>info@efsane-events.de</strong>.</p>
          
          <p>Mit freundlichen Grüßen<br>
          Ihr Team vom Efsane Gasthaus Rudolph</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">
            Efsane Gasthaus Rudolph | Traditionelle deutsche Küche seit 1620<br>
            Alt Niederhofheim 30, 65835 Liederbach am Taunus | Tel: 06196 23640
          </p>
        </div>
      </body>
      </html>
    `

    // Send email to restaurant
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@efsane-events.de',
      to: process.env.EMAIL_TO || 'info@efsane-events.de',
      subject: `Neue Kontaktanfrage von ${validatedData.name}`,
      html: restaurantEmailHtml,
      replyTo: validatedData.email,
    })

    // Send confirmation email to customer
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@efsane-events.de',
      to: validatedData.email,
      subject: 'Bestätigung Ihrer Nachricht - Efsane Gasthaus Rudolph',
      html: customerEmailHtml,
    })

    return NextResponse.json(
      { success: true, message: 'Nachricht erfolgreich gesendet' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Ungültige Eingabedaten', errors: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Fehler beim Senden der Nachricht' },
      { status: 500 }
    )
  }
}