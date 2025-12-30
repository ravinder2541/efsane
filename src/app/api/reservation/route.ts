import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

const reservationSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  date: z.string().refine((date) => new Date(date) > new Date()),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  guests: z.number().min(1).max(300),
  eventType: z.enum(['business', 'private', 'celebration']),
  specialRequests: z.string().max(1000).optional(),
})

// Initialize Supabase client with service role key for database operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = reservationSchema.parse(body)
    
    // Save reservation to database
    const { data: reservation, error: dbError } = await supabase
      .from('reservations')
      .insert([{
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        reservation_date: validatedData.date,
        reservation_time: validatedData.time,
        guests: validatedData.guests,
        event_type: validatedData.eventType,
        special_requests: validatedData.specialRequests || null,
        status: 'pending'
      }])
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { success: false, message: 'Failed to save reservation to database' },
        { status: 500 }
      )
    }
    
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

    // Format date and time for display (Europe/Berlin timezone)
    const reservationDateTime = new Date(`${validatedData.date}T${validatedData.time}:00`)
    const berlinDate = new Intl.DateTimeFormat('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Europe/Berlin'
    }).format(reservationDateTime)
    
    const reservationId = reservation.id

    const eventTypeLabels = {
      business: 'Geschäftstermin',
      private: 'Private Feier',
      celebration: 'Besondere Feier'
    }

    // Email to restaurant
    const restaurantEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Neue Reservierungsanfrage - Efsane Gasthaus Rudolph</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1B4332;">Neue Reservierungsanfrage (ID: ${reservationId})</h2>
          
          <div style="background: #fff8dc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1B4332; margin-top: 0;">Reservierungsdetails</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 30%;">Datum:</td>
                <td style="padding: 8px 0;">${berlinDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Uhrzeit:</td>
                <td style="padding: 8px 0;">${validatedData.time} Uhr</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Anzahl Gäste:</td>
                <td style="padding: 8px 0;">${validatedData.guests} ${validatedData.guests === 1 ? 'Person' : 'Personen'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Art der Veranstaltung:</td>
                <td style="padding: 8px 0;">${eventTypeLabels[validatedData.eventType]}</td>
              </tr>
            </table>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #1B4332;">Kontaktdaten</h3>
            <p><strong>Name:</strong> ${validatedData.name}</p>
            <p><strong>E-Mail:</strong> ${validatedData.email}</p>
            <p><strong>Telefon:</strong> ${validatedData.phone}</p>
          </div>
          
          ${validatedData.specialRequests ? `
          <div style="margin: 20px 0;">
            <h3 style="color: #1B4332;">Besondere Wünsche</h3>
            <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #FFD60A;">
              ${validatedData.specialRequests.replace(/\n/g, '<br>')}
            </div>
          </div>
          ` : ''}
          
          <div style="background: #1B4332; color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: white;">Wichtige Hinweise</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Bitte bestätigen Sie die Reservierung telefonisch oder per E-Mail</li>
              <li>Bei mehr als 50 Gästen sollten besondere Arrangements besprochen werden</li>
              <li>Parkplätze: 70+ Plätze verfügbar</li>
            </ul>
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
        <title>Bestätigung Ihrer Reservierungsanfrage - Efsane Gasthaus Rudolph</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1B4332;">Vielen Dank für Ihre Reservierungsanfrage!</h2>
          <p>Liebe/r ${validatedData.name},</p>
          <p>vielen Dank für Ihre Reservierungsanfrage im Efsane Gasthaus Rudolph. Wir haben Ihre Anfrage erhalten und werden uns schnellstmöglich bei Ihnen melden, um die Details zu besprechen und Ihre Reservierung zu bestätigen.</p>
          
          <div style="background: #fff8dc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1B4332; margin-top: 0;">Ihre Reservierungsanfrage</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 30%;">Datum:</td>
                <td style="padding: 8px 0;">${berlinDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Uhrzeit:</td>
                <td style="padding: 8px 0;">${validatedData.time} Uhr</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Anzahl Gäste:</td>
                <td style="padding: 8px 0;">${validatedData.guests} ${validatedData.guests === 1 ? 'Person' : 'Personen'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Art der Veranstaltung:</td>
                <td style="padding: 8px 0;">${eventTypeLabels[validatedData.eventType]}</td>
              </tr>
            </table>
            ${validatedData.specialRequests ? `
            <div style="margin-top: 15px;">
              <strong>Ihre besonderen Wünsche:</strong><br>
              <div style="background: #f9f9f9; padding: 10px; border-left: 4px solid #FFD60A; margin-top: 5px;">
                ${validatedData.specialRequests.replace(/\n/g, '<br>')}
              </div>
            </div>
            ` : ''}
          </div>
          
          <div style="background: #f0f9f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1B4332; margin-top: 0;">Was passiert als nächstes?</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Wir prüfen die Verfügbarkeit für Ihren gewünschten Termin</li>
              <li>Sie erhalten innerhalb von 24 Stunden eine Rückmeldung von uns</li>
              <li>Bei Verfügbarkeit bestätigen wir Ihre Reservierung schriftlich</li>
              <li>Gerne besprechen wir auch individuelle Menüwünsche mit Ihnen</li>
            </ul>
          </div>
          
          <div style="border: 2px solid #1B4332; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1B4332; margin-top: 0;">Kontakt für Rückfragen</h3>
            <p><strong>Telefon:</strong> 06196 23640<br>
            <strong>E-Mail:</strong> info@efsane-events.de<br>
            <strong>Öffnungszeiten:</strong> Mi-So: 16:00-22:00, Mo-Di: Geschlossen</p>
          </div>
          
          <p>Wir freuen uns darauf, Sie und Ihre Gäste in unserem traditionellen Gasthaus begrüßen zu dürfen!</p>
          
          <p>Mit freundlichen Grüßen<br>
          Ihr Team vom Efsane Gasthaus Rudolph</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">
            Efsane Gasthaus Rudolph | Traditionelle deutsche Küche seit 1620<br>
            Alt Niederhofheim 30, 65835 Liederbach am Taunus | Tel: 06196 23640<br>
            Kapazität: bis zu 300 Gäste | Parkplätze: 70+ kostenlose Plätze
          </p>
        </div>
      </body>
      </html>
    `

    // Send email to restaurant
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@efsane-events.de',
      to: process.env.EMAIL_TO || 'info@efsane-events.de',
      subject: `Neue Reservierung: ${validatedData.guests} Gäste am ${berlinDate}`,
      html: restaurantEmailHtml,
      replyTo: validatedData.email,
    })

    // Send confirmation email to customer
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@efsane-events.de',
      to: validatedData.email,
      subject: 'Bestätigung Ihrer Reservierungsanfrage - Efsane Gasthaus Rudolph',
      html: customerEmailHtml,
    })

    return NextResponse.json(
      { success: true, message: 'Reservierungsanfrage erfolgreich gesendet' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Reservation form error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Ungültige Eingabedaten', errors: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Fehler beim Senden der Reservierungsanfrage' },
      { status: 500 }
    )
  }
}