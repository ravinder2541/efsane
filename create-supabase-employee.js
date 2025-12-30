require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createEmployeeViaAuth() {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'employee@efsane-events.de',
      password: 'employee123',
      email_confirm: true,
      user_metadata: {
        role: 'employee',
        name: 'Reservierungs-Mitarbeiter'
      }
    })

    if (error) {
      console.error('❌ Error:', error)
    } else {
      console.log('✅ Employee user created successfully!')
      console.log('📧 Email: employee@efsane-events.de')
      console.log('🔑 Password: employee123')
      console.log('👤 Role: employee')
      console.log('🎯 Access: Reservations only')
      console.log('')
      console.log('🧪 Test at: http://localhost:3000/admin/login')
    }
  } catch (err) {
    console.error('Exception:', err)
  }
}

createEmployeeViaAuth()