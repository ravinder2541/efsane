import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  // port: parseInt(process.env.SMTP_PORT || '587'),
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_PORT === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(req: NextRequest) {
  try {
    const { reservationId } = await req.json()

    if (!reservationId) {
      return NextResponse.json(
        { error: 'Reservation ID is required' },
        { status: 400 }
      )
    }

    // Get reservation details
    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', reservationId)
      .single()

    if (reservationError || !reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      )
    }

    // Format date and time for German locale
    const reservationDate = new Date(`${reservation.date}T${reservation.time}`)
    const formattedDate = reservationDate.toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Europe/Berlin'
    })
    const formattedTime = reservationDate.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Berlin'
    })

    // Get event type in German
    const getEventTypeGerman = (type: string) => {
      switch (type) {
        case 'business': return 'Geschäftlich'
        case 'private': return 'Privat'
        case 'celebration': return 'Feier'
        default: return type
      }
    }

    // Create email content
    const emailHtml = `
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reservierung bestätigt - Efsane Events</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .container {
          background-color: white;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #d4a574;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #d4a574;
          margin-bottom: 10px;
        }
        .tagline {
          color: #666;
          font-style: italic;
        }
        .confirmation {
          background: linear-gradient(135deg, #d4a574, #c19660);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 30px;
        }
        .confirmation h1 {
          margin: 0;
          font-size: 24px;
        }
        .details {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          font-weight: bold;
          color: #555;
        }
        .detail-value {
          color: #333;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
          color: #666;
          font-size: 14px;
        }
        .contact-info {
          margin-top: 20px;
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 8px;
        }
        @media (max-width: 600px) {
          body {
            padding: 10px;
          }
          .container {
            padding: 20px;
          }
          .detail-row {
            flex-direction: column;
            gap: 5px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">EFSANE EVENTS</div>
          <div class="tagline">Ihr Partner für unvergessliche Veranstaltungen</div>
        </div>
        
        <div class="confirmation">
          <h1>🎉 Reservierung bestätigt!</h1>
          <p>Ihre Reservierung wurde erfolgreich bestätigt</p>
        </div>
        
        <div class="details">
          <h2 style="margin-top: 0; color: #d4a574;">Reservierungsdetails</h2>
          <div class="detail-row">
            <span class="detail-label">Name:</span>
            <span class="detail-value">${reservation.name}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">E-Mail:</span>
            <span class="detail-value">${reservation.email}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Telefon:</span>
            <span class="detail-value">${reservation.phone}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Datum:</span>
            <span class="detail-value">${formattedDate}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Uhrzeit:</span>
            <span class="detail-value">${formattedTime} Uhr</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Anzahl Gäste:</span>
            <span class="detail-value">${reservation.guests} ${reservation.guests === 1 ? 'Gast' : 'Gäste'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Veranstaltungstyp:</span>
            <span class="detail-value">${getEventTypeGerman(reservation.event_type)}</span>
          </div>
          ${reservation.special_requests ? `
          <div class="detail-row">
            <span class="detail-label">Besondere Wünsche:</span>
            <span class="detail-value">${reservation.special_requests}</span>
          </div>
          ` : ''}
        </div>
        
        <div class="contact-info">
          <h3 style="margin-top: 0; color: #d4a574;">Kontakt & Anfahrt</h3>
          <p><strong>Efsane Events</strong><br>
          Adresse: [Ihre Adresse hier]<br>
          Telefon: [Ihre Telefonnummer]<br>
          E-Mail: info@efsane-events.de</p>
          
          <p style="margin-bottom: 0;"><strong>Wichtige Hinweise:</strong><br>
          • Bitte kommen Sie pünktlich zu Ihrem Termin<br>
          • Bei Änderungen oder Stornierungen kontaktieren Sie uns bitte mindestens 24 Stunden im Voraus<br>
          • Wir freuen uns auf Ihren Besuch!</p>
        </div>
        
        <div class="footer">
          <p>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.</p>
          <p>&copy; 2024 Efsane Events. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </body>
    </html>
    `

    // Send confirmation email
    const mailOptions = {
      from: `"Efsane Events" <${process.env.SMTP_USER}>`,
      to: reservation.email,
      subject: `Reservierung bestätigt - ${formattedDate}, ${formattedTime} Uhr`,
      html: emailHtml,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ 
      success: true, 
      message: 'Bestätigungs-E-Mail erfolgreich gesendet' 
    })

  } catch (error) {
    console.error('Error sending confirmation email:', error)
    return NextResponse.json(
      { error: 'Fehler beim Senden der Bestätigungs-E-Mail' },
      { status: 500 }
    )
  }
}
