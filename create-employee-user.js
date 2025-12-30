require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createEmployeeUser() {
  // Employee user details
  const employeeEmail = 'employee@efsane-events.de'
  const employeePassword = 'employee123' // Change this to a secure password
  const employeeName = 'Reservierungs-Mitarbeiter'

  try {
    // Hash the password
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(employeePassword, saltRounds)

    // Create the employee user
    const { data, error } = await supabase
      .from('admin_users')
      .insert([
        {
          email: employeeEmail,
          password_hash: passwordHash,
          name: employeeName,
          role: 'employee',
          is_active: true
        }
      ])
      .select()

    if (error) {
      if (error.code === '23505') {
        console.log('❓ Employee user already exists with email:', employeeEmail)
      } else {
        console.error('❌ Error creating employee user:', error)
      }
    } else {
      console.log('✅ Successfully created employee user!')
      console.log('📧 Email:', employeeEmail)
      console.log('🔑 Password:', employeePassword)
      console.log('👤 Role: employee (reservations only)')
      console.log('🎯 Access: Can only manage reservations, not menu/categories')
      console.log('')
      console.log('🔐 IMPORTANT: Change the password after first login!')
    }
  } catch (err) {
    console.error('Exception:', err)
  }
}

createEmployeeUser()