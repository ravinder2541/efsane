import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/adminAuth'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const updateReservationSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
  notes: z.string().max(1000).optional(),
})

// GET - Fetch reservations with filters
export async function GET(request: NextRequest) {
  const user = verifyAdminToken(request)
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const status = searchParams.get('status')
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    let query = supabase
      .from('reservations')
      .select(`
        *,
        confirmed_by_user:admin_users!reservations_confirmed_by_fkey(
          name,
          email
        )
      `)
      .order('reservation_date', { ascending: true })
      .order('reservation_time', { ascending: true })

    // Apply filters
    if (date) {
      query = query.eq('reservation_date', date)
    } else if (month && year) {
      const startDate = `${year}-${month.padStart(2, '0')}-01`
      const endDate = new Date(parseInt(year), parseInt(month), 0).toISOString().split('T')[0]
      query = query.gte('reservation_date', startDate).lte('reservation_date', endDate)
    }

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: reservations, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 })
    }

    return NextResponse.json({ reservations })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new reservation (admin only)
export async function POST(request: NextRequest) {
  const user = verifyAdminToken(request)
  
  if (!user || user.role === 'employee') {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  try {
    const body = await request.json()
    
    const reservationData = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      reservation_date: body.date,
      reservation_time: body.time,
      guests: body.guests,
      event_type: body.eventType,
      special_requests: body.specialRequests || null,
      status: body.status || 'confirmed',
      notes: body.notes || null
    }

    const { data: reservation, error } = await supabase
      .from('reservations')
      .insert([reservationData])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 })
    }

    return NextResponse.json({ reservation })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
