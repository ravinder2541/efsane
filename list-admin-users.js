require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function listAdminUsers() {
  try {
    const { data: users, error } = await supabase
      .from('admin_users')
      .select('id, email, name, role, is_active, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching users:', error)
    } else {
      console.log('👥 Admin Users in Database:')
      console.log('=' .repeat(60))
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email}`)
        console.log(`   Name: ${user.name}`)
        console.log(`   Role: ${user.role}`)
        console.log(`   Active: ${user.is_active}`)
        console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`)
        console.log('')
      })
    }
  } catch (err) {
    console.error('Exception:', err)
  }
}

listAdminUsers()