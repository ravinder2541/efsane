import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { reservationId } = await request.json()

    if (!reservationId) {
      return NextResponse.json({ error: 'Reservation ID is required' }, { status: 400 })
    }

    console.log('Sending confirmation email for reservation:', reservationId)

    // Validate reservationId format
    if (!reservationId || typeof reservationId !== 'string' || reservationId.length < 10) {
      console.error('Invalid reservation ID format:', reservationId)
      return NextResponse.json({ error: 'Invalid reservation ID format' }, { status: 400 })
    }

    // Get reservation details
    console.log('Querying reservation with ID:', reservationId)
    
    const { data: reservation, error } = await (supabaseAdmin as any)
      .from('reservations')
      .select('*')
      .eq('id', reservationId)
      .single()

    if (error) {
      console.error('Reservation query error:', error)
      
      // Check if any reservations exist at all
      // For debugging - count total reservations
      const { data: allReservations, error: countError } = await (supabaseAdmin as any)
        .from('reservations')
        .select('id, name, status')
        .limit(5)
        
      if (countError) {
        console.error('Database connection error:', countError)
        return NextResponse.json({ 
          error: 'Datenbankverbindungsfehler. Bitte versuchen Sie es später erneut.' 
        }, { status: 500 })
      }
      
      console.log('Available reservations:', allReservations?.map((r: any) => ({ id: r.id, name: r.name })))
      
      return NextResponse.json({ 
        error: `Reservierung mit ID ${reservationId} wurde nicht gefunden. Möglicherweise wurde sie gelöscht oder die ID ist ungültig.` 
      }, { status: 404 })
    }

    if (!reservation) {
      return NextResponse.json({ error: 'Reservierung nicht gefunden' }, { status: 404 })
    }

    console.log('Found reservation:', reservation.name, reservation.email)

    // Allow confirmation emails for both pending and confirmed reservations
    if (reservation.status !== 'pending' && reservation.status !== 'confirmed') {
      return NextResponse.json({ error: 'Confirmation emails can only be sent to pending or confirmed reservations' }, { status: 400 })
    }

    // Check if we have valid SMTP configuration
    const isDemo = !process.env.SMTP_HOST || 
                   !process.env.SMTP_USER || 
                   !process.env.SMTP_PASS ||
                   process.env.SMTP_HOST === 'your-smtp-server.com' // Only block obvious placeholders

    if (isDemo) {
      console.log('⚠️  Demo mode: Missing SMTP configuration')
      console.log('📧 Demo Email Content Preview:')
      console.log('To:', reservation.email)
      console.log('Subject: Reservierungsbestätigung - Efsane Events')
      console.log('Content: Professional German confirmation email would be sent')
      
      // Still update the reservation notes
      await (supabaseAdmin as any)
        .from('reservations')
        .update({ 
          notes: reservation.notes ? 
            `${reservation.notes}\n[${new Date().toLocaleString('de-DE')}] Bestätigungs-E-Mail (Demo-Modus)` :
            `[${new Date().toLocaleString('de-DE')}] Bestätigungs-E-Mail (Demo-Modus)`
        })
        .eq('id', reservationId)

      return NextResponse.json({ 
        success: true, 
        message: 'Demo mode: Email would be sent successfully' 
      })
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,   // 10 seconds
      socketTimeout: 10000,     // 10 seconds
    })

    // Verify transporter configuration
    try {
      await transporter.verify()
      console.log('Email transporter verified successfully')
    } catch (verifyError) {
      console.error('Email transporter verification failed:', verifyError)
      return NextResponse.json({ 
        error: 'E-Mail-Konfiguration konnte nicht verifiziert werden. Bitte prüfen Sie die SMTP-Einstellungen.' 
      }, { status: 500 })
    }

    // Format date and time in German
    const reservationDate = new Date(reservation.reservation_date).toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const reservationTime = reservation.reservation_time.slice(0, 5) // Remove seconds

    // Get event type in German
    const eventTypeLabels = {
      business: 'Geschäftstermin',
      private: 'Private Feier',
      celebration: 'Besondere Feier'
    }
    const eventTypeGerman = eventTypeLabels[reservation.event_type as keyof typeof eventTypeLabels] || reservation.event_type

    // Create sleek HTML email template
    const htmlContent = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reservierung Bestätigt - Efsane Events</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .confirmation-badge {
            display: inline-block;
            background-color: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 24px;
        }
        .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 30px 0;
            padding: 24px;
            background-color: #f8fafc;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        .detail-item {
            display: flex;
            flex-direction: column;
        }
        .detail-label {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            color: #64748b;
            margin-bottom: 4px;
            letter-spacing: 0.5px;
        }
        .detail-value {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
        }
        .special-requests {
            margin: 24px 0;
            padding: 20px;
            background-color: #fef3c7;
            border-radius: 8px;
            border-left: 4px solid #f59e0b;
        }
        .special-requests h3 {
            color: #92400e;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        .special-requests p {
            color: #78350f;
            font-size: 14px;
        }
        .contact-info {
            margin-top: 32px;
            padding: 24px;
            background-color: #f1f5f9;
            border-radius: 8px;
            text-align: center;
        }
        .contact-info h3 {
            color: #334155;
            font-size: 16px;
            margin-bottom: 12px;
        }
        .contact-info p {
            color: #64748b;
            font-size: 14px;
            margin-bottom: 4px;
        }
        .footer {
            background-color: #1e293b;
            color: white;
            padding: 30px;
            text-align: center;
        }
        .footer p {
            font-size: 14px;
            opacity: 0.8;
        }
        @media (max-width: 480px) {
            .details-grid {
                grid-template-columns: 1fr;
                gap: 16px;
            }
            .container {
                margin: 0 16px;
            }
            .content {
                padding: 24px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Reservierung Bestätigt!</h1>
            <p>Ihre Reservierung bei Efsane Events wurde erfolgreich bestätigt</p>
        </div>
        
        <div class="content">
            <div class="confirmation-badge">
                ✅ BESTÄTIGT
            </div>
            
            <p style="font-size: 16px; margin-bottom: 24px;">
                Liebe/r <strong>${reservation.name}</strong>,
            </p>
            
            <p style="margin-bottom: 24px; color: #64748b;">
                vielen Dank für Ihre Reservierung! Wir freuen uns, Sie bei Efsane Events begrüßen zu dürfen. 
                Hier sind die Details Ihrer bestätigten Reservierung:
            </p>
            
            <div class="details-grid">
                <div class="detail-item">
                    <span class="detail-label">Datum</span>
                    <span class="detail-value">${reservationDate}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Uhrzeit</span>
                    <span class="detail-value">${reservationTime} Uhr</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Anzahl Gäste</span>
                    <span class="detail-value">${reservation.guests} ${reservation.guests === 1 ? 'Gast' : 'Gäste'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Veranstaltungstyp</span>
                    <span class="detail-value">${eventTypeGerman}</span>
                </div>
            </div>
            
            ${reservation.special_requests ? `
            <div class="special-requests">
                <h3>💡 Ihre besonderen Wünsche</h3>
                <p>${reservation.special_requests}</p>
            </div>
            ` : ''}
            
            <div style="margin: 32px 0; padding: 20px; background-color: #dbeafe; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <p style="color: #1e40af; margin-bottom: 8px;">
                    <strong>📋 Wichtige Hinweise:</strong>
                </p>
                <ul style="color: #1e40af; font-size: 14px; margin-left: 20px;">
                    <li>Bitte seien Sie pünktlich zu Ihrer Reservierung</li>
                    <li>Bei Änderungen oder Stornierungen kontaktieren Sie uns bitte rechtzeitig</li>
                    <li>Wir behalten uns vor, Tische nach 15 Minuten Verspätung weiterzuvergeben</li>
                </ul>
            </div>
            
            <div class="contact-info">
                <h3>📞 Kontakt & Anfahrt</h3>
                <p><strong>Efsane Events</strong></p>
                <p>Telefon: 06196 23640</p>
                <p>Öffnungszeiten: Mi-So: 16:00-22:00, Mo-Di: Geschlossen</p>
                <p>E-Mail: info@efsane-events.de</p>
                <p>Antwortzeit: Wir antworten innerhalb von 24h</p>
                <p>Adresse: Alt Niederhofheim 30, 65835 Liederbach am Taunus</p>
            </div>
            
            <p style="margin-top: 32px; text-align: center; color: #64748b;">
                Wir freuen uns auf Ihren Besuch! 🍽️✨
            </p>
        </div>
        
        <div class="footer">
            <p>© 2025 Efsane Events - Unvergessliche Momente erleben</p>
            <p style="font-size: 12px; margin-top: 8px;">
                Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese Nachricht.
            </p>
        </div>
    </div>
</body>
</html>
    `

    // Send email
    const mailOptions = {
      from: `"Efsane Events" <${process.env.SMTP_USER}>`,
      to: reservation.email,
      subject: `✅ Reservierung bestätigt - ${reservationDate} um ${reservationTime} Uhr`,
      html: htmlContent,
      text: `
Liebe/r ${reservation.name},

Ihre Reservierung bei Efsane Events wurde bestätigt!

Details:
- Datum: ${reservationDate}
- Uhrzeit: ${reservationTime} Uhr
- Gäste: ${reservation.guests}
- Veranstaltungstyp: ${eventTypeGerman}

${reservation.special_requests ? `Besondere Wünsche: ${reservation.special_requests}` : ''}

Wir freuen uns auf Ihren Besuch!

Kontakt & Anfahrt:
Efsane Events
Telefon: 06196 23640
Öffnungszeiten: Mi-So: 16:00-22:00, Mo-Di: Geschlossen
E-Mail: info@efsane-events.de
Antwortzeit: Wir antworten innerhalb von 24h
Adresse: Alt Niederhofheim 30, 65835 Liederbach am Taunus
      `.trim()
    }

    await transporter.sendMail(mailOptions)
    console.log('Confirmation email sent successfully to:', reservation.email)

    // Update reservation to mark email as sent
    await (supabaseAdmin as any)
      .from('reservations')
      .update({ 
        notes: reservation.notes ? 
          `${reservation.notes}\n[${new Date().toLocaleString('de-DE')}] Bestätigungs-E-Mail gesendet` :
          `[${new Date().toLocaleString('de-DE')}] Bestätigungs-E-Mail gesendet`
      })
      .eq('id', reservationId)

    return NextResponse.json({ 
      success: true, 
      message: 'Confirmation email sent successfully' 
    })

  } catch (error) {
    console.error('Error sending confirmation email:', error)
    return NextResponse.json({ 
      error: 'Failed to send confirmation email' 
    }, { status: 500 })
  }
}