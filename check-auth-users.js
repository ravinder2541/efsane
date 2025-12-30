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

async function listAuthUsers() {
  try {
    const { data: users, error } = await supabase.auth.admin.listUsers()

    if (error) {
      console.error('❌ Error fetching users:', error)
    } else {
      console.log('👥 Supabase Auth Users:')
      console.log('=' .repeat(80))
      users.users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email}`)
        console.log(`   ID: ${user.id}`)
        console.log(`   Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`)
        console.log(`   User Metadata:`, JSON.stringify(user.user_metadata, null, 2))
        console.log(`   App Metadata:`, JSON.stringify(user.app_metadata, null, 2))
        console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`)
        console.log('')
      })
    }
  } catch (err) {
    console.error('Exception:', err)
  }
}

listAuthUsers()