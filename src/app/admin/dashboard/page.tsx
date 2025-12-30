'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff, Search, ArrowUp, ArrowDown, Calendar, CheckCircle, Clock, XCircle, AlertCircle, Bell, Mail, Users, Edit } from 'lucide-react'

interface Category {
  id: string
  name_de: string
  name_en: string
  is_active: boolean
  created_at: string
}

interface MenuItem {
  id: string
  name_de: string
  name_en: string
  description_de: string | null
  description_en: string | null
  price: number
  volume?: string | null
  is_available: boolean
  is_popular: boolean
  is_vegetarian: boolean
  is_vegan: boolean
  category_id: string
  categories: {
    name_de: string
    name_en: string
  }
}

interface Reservation {
  id: string
  name: string
  email: string
  phone: string
  reservation_date: string
  reservation_time: string
  guests: number
  event_type: 'business' | 'private' | 'celebration'
  special_requests: string | null
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes: string | null
  confirmed_by: string | null
  confirmed_at: string | null
  created_at: string
  updated_at: string
  confirmed_by_user?: {
    name: string
    email: string
  }
}

function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [allReservations, setAllReservations] = useState<Reservation[]>([]) // For calendar - all reservations without filters
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingReservation, setEditingReservation] = useState<string | null>(null)

  // Calendar popup states
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null)
  const [showCalendarPopup, setShowCalendarPopup] = useState(false)
  const [calendarPopupReservations, setCalendarPopupReservations] = useState<Reservation[]>([])
  const [isAddingFromCalendar, setIsAddingFromCalendar] = useState(false)
  const [showAddItem, setShowAddItem] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showAddReservation, setShowAddReservation] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'reservations' | 'categories' | 'items' | 'users'>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'category' | 'created'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterAvailable, setFilterAvailable] = useState<'all' | 'available' | 'unavailable'>('all')
  
  // Reservations filters
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [reservationStatus, setReservationStatus] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'>('all')
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [quickFilter, setQuickFilter] = useState<'open' | 'today' | 'custom'>('open')
  
  // Notification states
  const [newReservationCount, setNewReservationCount] = useState(0)
  const [showNotification, setShowNotification] = useState(false)
  const [latestReservation, setLatestReservation] = useState<any>(null)
  const [lastReservationCheck, setLastReservationCheck] = useState(new Date())
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [sendingEmail, setSendingEmail] = useState<string | null>(null)
  const [emailSentStatus, setEmailSentStatus] = useState<Record<string, boolean>>({})

  // User management state
  const [users, setUsers] = useState<any[]>([])
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [showAddUser, setShowAddUser] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)

  // Role-based access control
  const isEmployee = user?.user_metadata?.role === 'employee' || user?.role === 'employee'
  const canAccessMenu = !isEmployee // Employees cannot access menu/categories
  
  const router = useRouter()
  
  // German translations for admin dashboard
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'title': 'Admin Dashboard',
      'overview': 'Übersicht', 
      'reservations': 'Reservierungen',
      'categories': 'Kategorien',
      'menu': 'Menü',
      'logout': 'Abmelden',
      'newReservation': 'Neue Reservierung hinzufügen',
      'filterByDate': 'Nach Datum filtern',
      'filterByStatus': 'Nach Status filtern', 
      'allStatuses': 'Alle Status',
      'pending': 'Ausstehend',
      'confirmed': 'Bestätigt',
      'cancelled': 'Storniert',
      'completed': 'Abgeschlossen',
      'todaysReservations': 'Heutige Reservierungen',
      'upcomingReservations': 'Kommende Reservierungen',
      'newReservationNotification': 'Neue Reservierung erhalten!',
      'soundNotification': 'Klick für Sound-Benachrichtigung',
      'noReservations': 'Keine Reservierungen gefunden',
      'actions': 'Aktionen',
      'edit': 'Bearbeiten',
      'delete': 'Löschen',
      'confirm': 'Bestätigen',
      'cancel': 'Abbrechen',
      'save': 'Speichern',
      'name': 'Name',
      'email': 'E-Mail',
      'phone': 'Telefon',
      'date': 'Datum',
      'time': 'Uhrzeit',
      'guests': 'Gäste',
      'eventType': 'Veranstaltungstyp',
      'status': 'Status',
      'notes': 'Notizen',
      'specialRequests': 'Besondere Wünsche',
      'business': 'Geschäftstermin',
      'private': 'Private Feier',
      'celebration': 'Besondere Feier',
      'addNewReservation': 'Neue Reservierung hinzufügen',
      'loading': 'Laden...',
      // Badge translations
      'active': 'Aktiv',
      'inactive': 'Inaktiv',
      'items': 'Artikel',
      'guest': 'Gast',
      // Menu item translations
      'available': 'Verfügbar',
      'unavailable': 'Nicht verfügbar',
      'allItems': 'Alle Artikel',
      'availableOnly': 'Nur verfügbare',
      'unavailableOnly': 'Nur nicht verfügbare',
      'allCategories': 'Alle Kategorien',
      'sortByName': 'Nach Name sortieren',
      'sortByPrice': 'Nach Preis sortieren',
      'sortByCategory': 'Nach Kategorie sortieren',
      'sortByCreated': 'Nach Erstellung sortieren',
      'clearAllFilters': 'Alle Filter löschen',
      'availableItems': 'Verfügbare Artikel',
      'searchItems': 'Artikel suchen...',
      'editCategory': 'Kategorie bearbeiten',
      'deleteCategory': 'Kategorie löschen',
      'confirmReservationAction': 'Reservierung bestätigen',
      'editReservationAction': 'Reservierung bearbeiten',
      'deleteReservationAction': 'Reservierung löschen',
      'sendConfirmationEmailAction': 'Bestätigungs-E-Mail senden',
      'internalNotes': 'Interne Notizen',
      'addItem': 'Artikel hinzufügen',
      'addCategory': 'Kategorie hinzufügen',
      'addNewCategory': 'Neue Kategorie hinzufügen'
    }
    return translations[key] || key
  }

  useEffect(() => {
    // Check current session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        // Debug: Log user data to see what we're getting
        console.log('🔍 User session data:', session.user)
        console.log('📋 User metadata:', session.user.user_metadata)
        console.log('🏷️ App metadata:', session.user.app_metadata)
        
        // Add role from user metadata
        const userWithRole = {
          ...session.user,
          role: session.user.user_metadata?.role || session.user.app_metadata?.role || 'admin' // Check both metadata sources
        }
        console.log('👤 Final user object:', userWithRole)
        console.log('🎯 User role:', userWithRole.role)
        
        setUser(userWithRole)
        loadData()
      } else {
        router.push('/admin/login')
      }
      setLoading(false)
    }

    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user)
          loadData()
        } else {
          router.push('/admin/login')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  // Load notification sound script
  useEffect(() => {
    // Check if script is already loaded
    const existingScript = document.querySelector('script[src="/notification-sound.js"]')
    if (existingScript) {
      return
    }
    
    const script = document.createElement('script')
    script.src = '/notification-sound.js'
    script.async = true
    script.id = 'notification-sound-script'
    document.head.appendChild(script)
    
    return () => {
      const scriptElement = document.getElementById('notification-sound-script')
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement)
      }
    }
  }, [])

  // Real-time notification system for new reservations
  useEffect(() => {
    if (!user) return

    console.log('🔄 Setting up real-time reservation notifications...')
    
    // Set up real-time subscription for new reservations
    const channel = supabase
      .channel('reservation-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reservations'
        },
        (payload) => {
          console.log('🆕 New reservation received!', payload.new)
          const newReservation = payload.new as any
          
          // Store latest reservation for notification display
          setLatestReservation(newReservation)
          
          // Update reservation count
          setNewReservationCount(prev => prev + 1)
          setShowNotification(true)
          
          // Play notification sound if enabled
          if (soundEnabled) {
            try {
              // Use the improved notification sound
              if (typeof (window as any).playNotificationSound === 'function') {
                (window as any).playNotificationSound();
              } else {
                // Fallback to simple beep
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = 800;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
              }
            } catch (e) {
              console.log('Audio notification failed:', e);
            }
          }
          
          // Show browser notification if permission granted
          if (Notification && Notification.permission === 'granted') {
            const reservation = payload.new as any
            new Notification('Neue Reservierung!', {
              body: `${reservation.name} - ${reservation.guest_count} Personen\n${reservation.reservation_date} um ${reservation.reservation_time}`,
              icon: '/favicon.ico',
              tag: 'new-reservation'
            })
          }
          
          // Auto-refresh reservations to show the new one
          loadReservations()
          
          // Auto-hide notification after 10 seconds
          setTimeout(() => setShowNotification(false), 10000)
        }
      )
      .subscribe()

    console.log('✅ Real-time subscription active')
    
    // Request notification permission if not already granted
    if (Notification && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('🔔 Notification permission:', permission)
      })
    }

    // Cleanup subscription on unmount
    return () => {
      console.log('🧹 Cleaning up real-time subscription...')
      supabase.removeChannel(channel)
    }
  }, [user, lastReservationCheck, soundEnabled])

  // Reload reservations when filters change
  useEffect(() => {
    if (user && activeTab === 'reservations') {
      loadReservations()
    }
  }, [selectedDate, reservationStatus, user, activeTab, currentMonth, currentYear, quickFilter])

  // Load users when users tab is accessed
  useEffect(() => {
    if (activeTab === 'users' && canAccessMenu && users.length === 0) {
      loadUsers()
    }
  }, [activeTab, canAccessMenu])

  const loadData = async () => {
    // Load categories
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .order('name_en')

    // Load menu items with categories
    const { data: itemsData } = await supabase
      .from('menu_items')
      .select(`
        *,
        categories (
          name_de,
          name_en
        )
      `)
      .order('name_en')

    if (categoriesData) setCategories(categoriesData)
    if (itemsData) setMenuItems(itemsData)
    
    // Load reservations for today by default
    await loadReservations()
    // Load all reservations for calendar
    await loadAllReservations()
  }

  // Load ALL reservations for calendar (no filters)
  const loadAllReservations = async () => {
    try {
      console.log('📅 Loading ALL reservations for calendar...')

      const { data: allReservationsData, error } = await (supabase as any)
        .from('reservations')
        .select('*')
        .order('reservation_date', { ascending: true })
        .order('reservation_time', { ascending: true })

      if (error) {
        console.error('❌ Failed to load all reservations:', error.message || error)
      } else {
        console.log('✅ All reservations loaded for calendar:', allReservationsData?.length || 0)
        setAllReservations(allReservationsData || [])
      }
    } catch (error) {
      console.error('Failed to load all reservations:', error instanceof Error ? error.message : String(error))
    }
  }

  // Handle calendar day click
  const handleCalendarDayClick = (dateStr: string, dayReservations: Reservation[]) => {
    setSelectedCalendarDate(dateStr)
    setCalendarPopupReservations(dayReservations)
    setIsAddingFromCalendar(dayReservations.length === 0) // If no reservations, show add form
    setShowCalendarPopup(true)
  }

  const loadReservations = async () => {
    try {
      console.log('🔍 Loading reservations with quickFilter:', quickFilter, 'status:', reservationStatus)
      console.log('📅 Current month/year:', currentMonth, currentYear)
      console.log('📍 Selected date:', selectedDate)
      
      let query = (supabase as any)
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false }) // Show newest first
        .order('reservation_date', { ascending: true })
        .order('reservation_time', { ascending: true })

      // Apply filters based on quick filter mode
      if (quickFilter === 'open') {
        // Show upcoming reservations (pending and confirmed reservations in the future)
        const now = new Date()
        query = query.in('status', ['pending', 'confirmed'])
        console.log('✅ UPCOMING RESERVATIONS - showing future pending and confirmed reservations')
      } else if (quickFilter === 'today') {
        // Show today's reservations regardless of status
        const today = new Date().toISOString().split('T')[0]
        query = query.eq('reservation_date', today)
        console.log('📅 TODAY FILTER applied:', today)
        if (reservationStatus !== 'all') {
          query = query.eq('status', reservationStatus)
        }
      } else {
        // Custom filtering mode
        // Apply date filters
        if (selectedDate && selectedDate !== '') {
          console.log('📅 Date filter applied:', selectedDate)
          query = query.eq('reservation_date', selectedDate)
        } else {
          // Filter by month if no specific date selected
          const startOfMonth = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`
          const endOfMonth = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0]
          console.log('📅 Month filtering applied:', startOfMonth, 'to', endOfMonth)
          query = query.gte('reservation_date', startOfMonth).lte('reservation_date', endOfMonth)
        }
        
        if (reservationStatus !== 'all') {
          console.log('🏷️ Status filter applied:', reservationStatus)
          query = query.eq('status', reservationStatus)
        }
      }

      console.log('🔄 Executing database query...')
      const { data: reservationsData, error } = await query

      if (error) {
        console.error('❌ Failed to load reservations:', error.message || error)
        console.error('Full error:', error)
      } else {
        console.log('✅ Raw reservations loaded:', reservationsData?.length || 0)
        console.log('📊 All reservation data:', reservationsData)
        if (reservationsData && reservationsData.length > 0) {
          console.log('📋 Sample reservations:', reservationsData.slice(0, 3).map((r: any) => ({ 
            id: r.id, 
            name: r.name, 
            status: r.status, 
            date: r.reservation_date,
            created: r.created_at
          })))
          
          // Check which reservations already have confirmation emails sent
          const emailSentMap: Record<string, boolean> = {}
          reservationsData.forEach((reservation: any) => {
            const hasEmailSent = reservation.notes && 
              (reservation.notes.includes('Bestätigungs-E-Mail gesendet') || 
               reservation.notes.includes('Bestätigungs-E-Mail (Demo-Modus)'))
            emailSentMap[reservation.id] = hasEmailSent
          })
          setEmailSentStatus(emailSentMap)
        }
        
        // Filter for upcoming reservations if in open mode
        let filteredReservations = reservationsData || []
        if (quickFilter === 'open') {
          const now = new Date()
          filteredReservations = filteredReservations.filter((r: any) => {
            const reservationDateTime = new Date(r.reservation_date + 'T' + r.reservation_time)
            return reservationDateTime >= now
          })
          console.log('⏰ UPCOMING FILTER applied - showing', filteredReservations.length, 'future reservations')
        }
        
        // Sort to prioritize pending reservations with newest first at the top
        const sortedReservations = filteredReservations.sort((a: any, b: any) => {
          // PRIORITY 1: All pending reservations always at the top
          if (a.status === 'pending' && b.status !== 'pending') return -1
          if (b.status === 'pending' && a.status !== 'pending') return 1

          // PRIORITY 2: Within pending reservations, newest created first (most recent at top)
          if (a.status === 'pending' && b.status === 'pending') {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          }

          // PRIORITY 3: For non-pending reservations, sort by reservation date (upcoming first)
          const dateA = new Date(a.reservation_date + 'T' + a.reservation_time)
          const dateB = new Date(b.reservation_date + 'T' + b.reservation_time)
          return dateA.getTime() - dateB.getTime()
        })
        
        console.log('🎯 Final sorted reservations:', sortedReservations.length)
        console.log('📋 Sorted data:', sortedReservations.map((r: any) => ({ name: r.name, status: r.status, created: r.created_at })))
        setReservations(sortedReservations)
      }
    } catch (error) {
      console.error('Failed to load reservations:', error instanceof Error ? error.message : String(error))
    }
  }

  // Reservation management functions
  const updateReservationStatus = async (id: string, status: Reservation['status'], notes?: string) => {
    try {
      const { error } = await (supabase as any)
        .from('reservations')
        .update({ 
          status,
          notes: notes || null,
          confirmed_by: status === 'confirmed' ? user?.id : null,
          confirmed_at: status === 'confirmed' ? new Date().toISOString() : null
        })
        .eq('id', id)

      if (!error) {
        // Update local state instead of reloading to keep reservations visible
        setReservations(prevReservations => 
          prevReservations.map(reservation => 
            reservation.id === id 
              ? { 
                  ...reservation, 
                  status,
                  notes: notes || reservation.notes,
                  confirmed_by: status === 'confirmed' ? (user?.id || null) : reservation.confirmed_by,
                  confirmed_at: status === 'confirmed' ? new Date().toISOString() : reservation.confirmed_at
                }
              : reservation
          )
        )
      } else {
        console.error('Error updating reservation:', error)
      }
    } catch (error) {
      console.error('Error updating reservation:', error)
    }
  }

  const deleteReservation = async (id: string) => {
    if (confirm('Are you sure you want to delete this reservation?')) {
      try {
        const { error } = await supabase
          .from('reservations')
          .delete()
          .eq('id', id)

        if (!error) {
          await loadReservations()
          await loadAllReservations() // Also reload calendar data
        } else {
          console.error('Error deleting reservation:', error)
        }
      } catch (error) {
        console.error('Error deleting reservation:', error)
      }
    }
  }

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    const { error } = await (supabase as any)
      .from('menu_items')
      .update(updates)
      .eq('id', id)

    if (!error) {
      loadData()
      setEditingItem(null)
    }
  }

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const { error } = await (supabase as any)
      .from('categories')
      .update(updates)
      .eq('id', id)

    if (!error) {
      // Reload admin data
      loadData()
      setEditingCategory(null)
      
      // Optional: Force refresh the frontend menu cache
      try {
        await fetch('/api/revalidate-menu', { method: 'POST' })
        console.log('Menu cache cleared successfully')
      } catch (error) {
        console.log('Note: Menu cache clearing not available')
      }
    }
  }

  const deleteMenuItem = async (id: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id)

      if (!error) {
        loadData()
      }
    }
  }

  const deleteCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category? All items in this category will also be deleted.')) {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (!error) {
        loadData()
      }
    }
  }

  const updateReservation = async (id: string, updates: Partial<Reservation>) => {
    try {
      const { error } = await (supabase as any)
        .from('reservations')
        .update(updates)
        .eq('id', id)

      if (!error) {
        // Update all reservation states for real-time UI updates
        const updateFunction = (reservation: Reservation) =>
          reservation.id === id ? { ...reservation, ...updates } : reservation

        // Update main reservations list
        setReservations(prevReservations => prevReservations.map(updateFunction))

        // Update calendar data (allReservations)
        setAllReservations(prevAllReservations => prevAllReservations.map(updateFunction))

        // Update calendar popup data if it's open and contains this reservation
        setCalendarPopupReservations(prevPopupReservations =>
          prevPopupReservations.map(updateFunction)
        )

        setEditingReservation(null)
      } else {
        console.error('Error updating reservation:', error)
      }
    } catch (error) {
      console.error('Failed to update reservation:', error)
    }
  }

  const sendConfirmationEmail = async (reservationId: string) => {
    setSendingEmail(reservationId)
    try {
      console.log('Attempting to send email for reservation ID:', reservationId)

      // Find the reservation details from any available source
      let reservation = reservations.find(r => r.id === reservationId)
      if (!reservation) {
        reservation = allReservations.find(r => r.id === reservationId)
      }
      if (!reservation) {
        reservation = calendarPopupReservations.find(r => r.id === reservationId)
      }

      if (!reservation) {
        alert('❌ Fehler: Reservierung wurde nicht gefunden.')
        return
      }
      
      const response = await fetch('/api/admin/send-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reservationId
        }),
      })

      const result = await response.json()

      if (response.ok) {
        // Mark as sent locally - no need to reload reservations
        setEmailSentStatus(prev => ({ ...prev, [reservationId]: true }))
        
        alert(`✅ Bestätigungs-E-Mail erfolgreich versendet!\n\n` +
              `📧 Empfänger: ${reservation.name} (${reservation.email})\n` +
              `📅 Termin: ${new Date(reservation.reservation_date).toLocaleDateString('de-DE')} um ${reservation.reservation_time}\n\n` +
              `Die E-Mail wurde versendet und bleibt in der Liste sichtbar.`)
        
        // DON'T reload reservations - keep them visible in the current view
        // The user can manually refresh if they want to see updated notes
      } else {
        console.error('Email sending failed:', result)
        alert(`❌ Fehler: ${result.error || 'Unbekannter Fehler'}`)
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error)
      alert('❌ Fehler beim Senden der Bestätigungs-E-Mail')
    } finally {
      setSendingEmail(null)
    }
  }

  // User management functions
  const loadUsers = async () => {
    setLoadingUsers(true)
    try {
      const response = await fetch('/api/admin/users')
      const result = await response.json()
      
      if (response.ok) {
        setUsers(result.users)
      } else {
        console.error('Failed to load users:', result.error)
        alert('❌ Fehler beim Laden der Benutzer: ' + result.error)
      }
    } catch (error) {
      console.error('Error loading users:', error)
      alert('❌ Fehler beim Laden der Benutzer')
    } finally {
      setLoadingUsers(false)
    }
  }

  const createUser = async (userData: { email: string, password?: string, name: string, role: string }) => {
    if (!userData.password) {
      alert('❌ Passwort ist erforderlich beim Erstellen eines neuen Benutzers')
      return
    }
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          name: userData.name,
          role: userData.role
        })
      })
      
      const result = await response.json()
      
      if (response.ok) {
        alert('✅ Benutzer erfolgreich erstellt!')
        loadUsers() // Reload users list
        setShowAddUser(false)
      } else {
        alert('❌ Fehler beim Erstellen des Benutzers: ' + result.error)
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('❌ Fehler beim Erstellen des Benutzers')
    }
  }

  const updateUser = async (userId: string, userData: { email: string, password?: string, name: string, role: string }) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      
      const result = await response.json()
      
      if (response.ok) {
        alert('✅ Benutzer erfolgreich aktualisiert!')
        loadUsers() // Reload users list
        setEditingUser(null)
      } else {
        alert('❌ Fehler beim Aktualisieren des Benutzers: ' + result.error)
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('❌ Fehler beim Aktualisieren des Benutzers')
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('Sind Sie sicher, dass Sie diesen Benutzer löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (response.ok) {
        alert('✅ Benutzer erfolgreich gelöscht!')
        loadUsers() // Reload users list
      } else {
        alert('❌ Fehler beim Löschen des Benutzers: ' + result.error)
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('❌ Fehler beim Löschen des Benutzers')
    }
  }



  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  // Filtered and sorted menu items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = menuItems.filter(item => {
      // Search filter
      const searchMatch = searchTerm === '' ||
        item.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name_de.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description_en && item.description_en.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.description_de && item.description_de.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.categories.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.categories.name_de.toLowerCase().includes(searchTerm.toLowerCase())

      // Category filter
      const categoryMatch = filterCategory === 'all' || item.category_id === filterCategory

      // Availability filter
      const availabilityMatch = filterAvailable === 'all' ||
        (filterAvailable === 'available' && item.is_available) ||
        (filterAvailable === 'unavailable' && !item.is_available)

      return searchMatch && categoryMatch && availabilityMatch
    })

    // Sort items
    filtered.sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortBy) {
        case 'name':
          aValue = a.name_en.toLowerCase()
          bValue = b.name_en.toLowerCase()
          break
        case 'price':
          aValue = a.price
          bValue = b.price
          break
        case 'category':
          aValue = a.categories.name_en.toLowerCase()
          bValue = b.categories.name_en.toLowerCase()
          break
        case 'created':
          aValue = a.id // Using ID as proxy for creation order
          bValue = b.id
          break
        default:
          aValue = a.name_en.toLowerCase()
          bValue = b.name_en.toLowerCase()
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [menuItems, searchTerm, sortBy, sortOrder, filterCategory, filterAvailable])

  const handleSort = (field: 'name' | 'price' | 'category' | 'created') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const getStatusIcon = (status: Reservation['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEventTypeLabel = (type: Reservation['event_type']) => {
    switch (type) {
      case 'business':
        return 'Geschäftlich'
      case 'private':
        return 'Privat'
      case 'celebration':
        return 'Feier'
      default:
        return ''
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
              <p className="text-gray-600">Willkommen, {user.email}</p>
              <p className="text-xs text-gray-500">
                {isEmployee ? '👨‍💼 Employee (Nur Reservierungen)' : '👑 Admin (Vollzugriff)'}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notification Center */}
              <div className="relative">
                {showNotification && latestReservation && (
                  <div className="absolute -top-32 right-0 bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-lg shadow-xl z-10 min-w-80 max-w-96">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <Bell className="h-5 w-5 animate-pulse flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-bold text-sm">{t('newReservationNotification')}</div>
                          <div className="mt-1 text-xs space-y-1">
                            <div className="font-semibold">{latestReservation.name}</div>
                            <div className="flex items-center gap-2">
                              <span>{latestReservation.guest_count} Personen</span>
                              <span>•</span>
                              <span>{new Date(latestReservation.reservation_date).toLocaleDateString('de-DE')}</span>
                              <span>•</span>
                              <span>{latestReservation.reservation_time}</span>
                            </div>
                            {latestReservation.phone && (
                              <div className="text-green-200">📞 {latestReservation.phone}</div>
                            )}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setShowNotification(false)}
                        className="text-white/70 hover:text-white ml-2 flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`relative p-2 rounded-full transition-colors ${
                    soundEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}
                  title={t('soundNotification')}
                >
                  <Bell className="h-5 w-5" />
                  {newReservationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {newReservationCount > 9 ? '9+' : newReservationCount}
                    </span>
                  )}
                </button>
              </div>

              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {(() => {
              const tabs = [
                { id: 'overview', label: t('overview'), icon: '📊' },
                { id: 'reservations', label: t('reservations'), icon: '📅' },
                ...(canAccessMenu ? [
                  { id: 'categories', label: t('categories'), icon: '📁' },
                  { id: 'items', label: t('menu'), icon: '🍽️' },
                  { id: 'users', label: 'Benutzer', icon: '👥' }
                ] : [])
              ]
              
              console.log('🎯 Role Debug:')
              console.log('   - User object:', user)
              console.log('   - User metadata role:', user?.user_metadata?.role)
              console.log('   - User role:', user?.role)
              console.log('   - Is employee:', isEmployee)
              console.log('   - Can access menu:', canAccessMenu)
              console.log('   - Tabs shown:', tabs.map(t => t.id))
              
              return tabs
            })().map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Items</p>
                      <p className="text-3xl font-bold">{menuItems.length}</p>
                    </div>
                    <div className="text-4xl opacity-80">🍽️</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Categories</p>
                      <p className="text-3xl font-bold">{categories.length}</p>
                    </div>
                    <div className="text-4xl opacity-80">📁</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Available</p>
                      <p className="text-3xl font-bold">{menuItems.filter(item => item.is_available).length}</p>
                    </div>
                    <div className="text-4xl opacity-80">✅</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">Popular</p>
                      <p className="text-3xl font-bold">{menuItems.filter(item => item.is_popular).length}</p>
                    </div>
                    <div className="text-4xl opacity-80">⭐</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-xl text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-100">Kommende</p>
                      <p className="text-3xl font-bold">
                        {allReservations.filter(r => {
                          const reservationDate = new Date(r.reservation_date + 'T' + r.reservation_time)
                          return reservationDate >= new Date() && r.status !== 'cancelled'
                        }).length}
                      </p>
                    </div>
                    <div className="text-4xl opacity-80">📅</div>
                  </div>
                </div>
              </div>

              {/* Monthly Calendar View */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Reservierungs-Kalender</h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => {
                        const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1
                        const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear
                        setCurrentMonth(prevMonth)
                        setCurrentYear(prevYear)
                      }}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      ←
                    </button>
                    <span className="text-lg font-medium text-gray-900 min-w-[200px] text-center">
                      {new Date(currentYear, currentMonth - 1).toLocaleDateString('de-DE', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                    <button
                      onClick={() => {
                        const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1
                        const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear
                        setCurrentMonth(nextMonth)
                        setCurrentYear(nextYear)
                      }}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      →
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Day Headers */}
                  {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
                    <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50 rounded-lg">
                      {day}
                    </div>
                  ))}

                  {/* Calendar Days */}
                  {(() => {
                    const firstDay = new Date(currentYear, currentMonth - 1, 1)
                    const lastDay = new Date(currentYear, currentMonth, 0)
                    const startDate = new Date(firstDay)

                    // Adjust to Monday start (getDay() returns 0 for Sunday, 1 for Monday, etc.)
                    const dayOfWeek = firstDay.getDay()
                    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1
                    startDate.setDate(startDate.getDate() - mondayOffset)

                    const days = []
                    const today = new Date()

                    for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
                      const currentDate = new Date(startDate)
                      currentDate.setDate(startDate.getDate() + i)

                      const isCurrentMonth = currentDate.getMonth() === currentMonth - 1
                      const isToday = currentDate.toDateString() === today.toDateString()
                      // Generate date string without timezone conversion
                      const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`

                      // Count ALL reservations for this date (using unfiltered data)
                      const dayReservations = allReservations.filter(r =>
                        r.reservation_date === dateStr && r.status !== 'cancelled'
                      )

                      days.push(
                        <div
                          key={i}
                          onClick={() => isCurrentMonth && handleCalendarDayClick(dateStr, dayReservations)}
                          className={`p-2 min-h-[80px] border rounded-lg transition-all duration-200 ${
                            isCurrentMonth
                              ? isToday
                                ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 cursor-pointer hover:shadow-md'
                                : 'bg-white border-gray-200 hover:bg-gray-50 cursor-pointer hover:shadow-md'
                              : 'bg-gray-50 border-gray-100 text-gray-400'
                          }`}
                          title={dayReservations.length > 0 ?
                            `${dayReservations.length} Reservierungen - Klicken für Details` :
                            'Klicken um Reservierung hinzuzufügen'
                          }
                        >
                          <div className={`text-sm font-medium ${
                            isToday ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            {currentDate.getDate()}
                          </div>
                          {dayReservations.length > 0 && isCurrentMonth && (
                            <div className="mt-1 space-y-1">
                              {/* Main count badge - always visible */}
                              <div className={`text-xs px-2 py-1 rounded-full text-center font-bold ${
                                dayReservations.length >= 8
                                  ? 'bg-red-500 text-white'
                                  : dayReservations.length >= 5
                                  ? 'bg-red-100 text-red-700'
                                  : dayReservations.length >= 3
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {dayReservations.length}
                              </div>

                              {/* Show only first reservation time for space efficiency */}
                              {dayReservations.length > 0 && (
                                <div className="text-xs text-gray-600 text-center font-medium">
                                  {dayReservations[0].reservation_time.slice(0,5)}
                                  {dayReservations.length > 1 && (
                                    <span className="text-gray-400"> +{dayReservations.length - 1}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    }

                    return days
                  })()}
                </div>
              </div>

              {/* Upcoming Reservations List */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{t('upcomingReservations')}</h3>
                  <button
                    onClick={() => setActiveTab('reservations')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Alle anzeigen →
                  </button>
                </div>
                <div className="space-y-3">
                  {allReservations
                    .filter(reservation => {
                      const reservationDate = new Date(reservation.reservation_date + 'T' + reservation.reservation_time)
                      return reservationDate >= new Date() && reservation.status !== 'cancelled'
                    })
                    .slice(0, 5)
                    .map(reservation => {
                      const reservationDate = new Date(reservation.reservation_date)
                      const today = new Date()
                      const tomorrow = new Date(today)
                      tomorrow.setDate(today.getDate() + 1)

                      let dateDisplay = ''
                      if (reservationDate.toDateString() === today.toDateString()) {
                        dateDisplay = 'Heute'
                      } else if (reservationDate.toDateString() === tomorrow.toDateString()) {
                        dateDisplay = 'Morgen'
                      } else {
                        dateDisplay = reservationDate.toLocaleDateString('de-DE', {
                          weekday: 'short',
                          day: '2-digit',
                          month: '2-digit'
                        })
                      }

                      return (
                        <div key={reservation.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className={`w-3 h-3 rounded-full ${
                                reservation.status === 'confirmed' ? 'bg-green-500' :
                                reservation.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'
                              }`}></div>
                              <span className="font-semibold text-gray-900">{reservation.name}</span>
                              <span className="text-sm text-gray-500">({reservation.guests} Gäste)</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm mb-1">
                              <div className="flex items-center space-x-1 text-blue-600 font-medium">
                                <Calendar className="w-4 h-4" />
                                <span>{dateDisplay}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-gray-600 font-medium">
                                <Clock className="w-4 h-4" />
                                <span>{reservation.reservation_time.slice(0,5)} Uhr</span>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500">
                              Erhalten: {new Date(reservation.created_at).toLocaleDateString('de-DE', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit'
                              })} um {new Date(reservation.created_at).toLocaleTimeString('de-DE', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })} Uhr
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                              reservation.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : reservation.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {reservation.status === 'confirmed' ? t('confirmed') :
                               reservation.status === 'pending' ? t('pending') :
                               reservation.status}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  {allReservations.filter(r => {
                    const reservationDate = new Date(r.reservation_date + 'T' + r.reservation_time)
                    return reservationDate >= new Date() && r.status !== 'cancelled'
                  }).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      {t('noReservations')}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Schnellaktionen</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab('reservations')}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                  >
                    <div className="text-2xl mb-2">📅</div>
                    <div className="font-medium text-gray-900">Manage Reservations</div>
                    <div className="text-sm text-gray-500">View and manage bookings</div>
                  </button>
                  {canAccessMenu && (
                    <>
                      <button
                        onClick={() => setActiveTab('categories')}
                        className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center"
                      >
                        <div className="text-2xl mb-2">📁</div>
                        <div className="font-medium text-gray-900">Manage Categories</div>
                        <div className="text-sm text-gray-500">Add, edit, or remove categories</div>
                      </button>
                      <button
                        onClick={() => setActiveTab('items')}
                        className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-center"
                      >
                        <div className="text-2xl mb-2">🍽️</div>
                        <div className="font-medium text-gray-900">Manage Menu Items</div>
                        <div className="text-sm text-gray-500">Add, edit, or remove menu items</div>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Menu Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">By Category</h4>
                    <div className="space-y-2">
                      {categories.slice(0, 5).map((category) => {
                        const itemCount = menuItems.filter(item => item.category_id === category.id).length
                        return (
                          <div key={category.id} className="flex justify-between text-sm">
                            <span className="text-gray-600">{category.name_en}</span>
                            <span className="font-medium">{itemCount} items</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Dietary Options</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">🥬 Vegetarian</span>
                        <span className="font-medium">{menuItems.filter(item => item.is_vegetarian).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">🌱 Vegan</span>
                        <span className="font-medium">{menuItems.filter(item => item.is_vegan).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">⭐ Popular</span>
                        <span className="font-medium">{menuItems.filter(item => item.is_popular).length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reservations Tab */}
          {activeTab === 'reservations' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">{t('reservations')} ({reservations.length})</h2>
                {user?.role !== 'employee' && (
                  <button
                    onClick={() => setShowAddReservation(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    {t('newReservation')}
                  </button>
                )}
              </div>

              {/* Quick Filter Buttons */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-wrap gap-3 mb-6">
                  <button
                    onClick={() => {
                      setQuickFilter('open')
                      setSelectedDate('')
                      setReservationStatus('all')
                    }}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      quickFilter === 'open'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Kommende Reservierungen
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      {allReservations.filter(r => {
                        const reservationDate = new Date(r.reservation_date + 'T' + r.reservation_time)
                        return reservationDate >= new Date() && ['pending', 'confirmed'].includes(r.status)
                      }).length}
                    </span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setQuickFilter('today')
                      setSelectedDate('')
                      setReservationStatus('all')
                    }}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      quickFilter === 'today'
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    Heute
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      {allReservations.filter(r => {
                        const today = new Date().toISOString().split('T')[0]
                        return r.reservation_date === today && r.status !== 'cancelled'
                      }).length}
                    </span>
                  </button>
                  
                  <button
                    onClick={() => setQuickFilter('custom')}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      quickFilter === 'custom'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Search className="w-4 h-4" />
                    Erweiterte Filter
                  </button>
                </div>

                {/* Advanced Filters (only show when custom is selected) */}
                {quickFilter === 'custom' && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('filterByDate')}</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('filterByStatus')}</label>
                      <select
                        value={reservationStatus}
                        onChange={(e) => setReservationStatus(e.target.value as typeof reservationStatus)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">{t('allStatuses')}</option>
                        <option value="pending">{t('pending')}</option>
                        <option value="confirmed">{t('confirmed')}</option>
                        <option value="cancelled">{t('cancelled')}</option>
                        <option value="completed">{t('completed')}</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          setSelectedDate(new Date().toISOString().split('T')[0])
                          setReservationStatus('all')
                        }}
                        className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        {t('todaysReservations')}
                      </button>
                    </div>
                    <div className="flex items-end">
                      <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Monat</label>
                        <div className="flex">
                          <button
                            onClick={() => {
                              const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1
                              const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear
                              setCurrentMonth(prevMonth)
                              setCurrentYear(prevYear)
                            }}
                            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-l-lg hover:bg-gray-300 transition-colors"
                          >
                            ‹
                          </button>
                          <div className="flex-1 px-3 py-2 bg-white border-t border-b border-gray-300 text-center text-sm font-medium">
                            {new Date(currentYear, currentMonth - 1).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
                          </div>
                          <button
                            onClick={() => {
                              const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1
                              const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear
                              setCurrentMonth(nextMonth)
                              setCurrentYear(nextYear)
                            }}
                            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-r-lg hover:bg-gray-300 transition-colors"
                          >
                            ›
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {reservations.filter(r => r.status === 'pending').length}
                    </div>
                    <div className="text-sm text-yellow-800">{t('pending')}</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {reservations.filter(r => r.status === 'confirmed').length}
                    </div>
                    <div className="text-sm text-green-800">{t('confirmed')}</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {reservations.reduce((sum, r) => r.status === 'confirmed' ? sum + r.guests : sum, 0)}
                    </div>
                    <div className="text-sm text-blue-800">Gäste gesamt</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {reservations.filter(r => r.status === 'completed').length}
                    </div>
                    <div className="text-sm text-purple-800">{t('completed')}</div>
                  </div>
                </div>
              </div>

              {/* Add Reservation Form */}
              {showAddReservation && user?.role !== 'employee' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('addNewReservation')}</h3>
                  <AddReservationForm
                    onSave={async (newReservation) => {
                      loadReservations()
                      loadAllReservations() // Also reload calendar data
                      setShowAddReservation(false)
                    }}
                    onCancel={() => setShowAddReservation(false)}
                    isBackendForm={true}
                  />
                </div>
              )}

              {/* Reservations List */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {reservations.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No reservations found</h3>
                    <p className="text-gray-500">
                      {selectedDate !== new Date().toISOString().split('T')[0]
                        ? `No reservations for ${selectedDate}`
                        : 'No reservations for today'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {reservations
                      .map((reservation) => (
                        <div key={reservation.id} className="p-6 hover:bg-gray-50 transition-colors">
                          {editingReservation === reservation.id ? (
                            <ReservationEditor 
                              reservation={reservation} 
                              onSave={updateReservation} 
                              onCancel={() => setEditingReservation(null)} 
                            />
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                                  {reservation.guests}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-semibold text-gray-900">{reservation.name}</h3>
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getStatusColor(reservation.status)}`}>
                                      {getStatusIcon(reservation.status)}
                                      {t(reservation.status)}
                                    </span>
                                  </div>

                                  {/* Date and Time Display */}
                                  <div className="flex items-center gap-4 mb-2">
                                    <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
                                      <Calendar className="w-4 h-4" />
                                      <span>
                                        {(() => {
                                          const reservationDate = new Date(reservation.reservation_date)
                                          const today = new Date()
                                          const tomorrow = new Date(today)
                                          tomorrow.setDate(today.getDate() + 1)

                                          if (reservationDate.toDateString() === today.toDateString()) {
                                            return 'Heute'
                                          } else if (reservationDate.toDateString() === tomorrow.toDateString()) {
                                            return 'Morgen'
                                          } else {
                                            return reservationDate.toLocaleDateString('de-DE', {
                                              weekday: 'long',
                                              day: '2-digit',
                                              month: '2-digit',
                                              year: 'numeric'
                                            })
                                          }
                                        })()}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                                      <Clock className="w-4 h-4" />
                                      <span>{reservation.reservation_time.slice(0, 5)} Uhr</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span>{reservation.email}</span>
                                    <span>{reservation.phone}</span>
                                    <span>{getEventTypeLabel(reservation.event_type)}</span>
                                    <span>{reservation.guests} {reservation.guests === 1 ? t('guest') : t('guests')}</span>
                                  </div>

                                  {/* Received Date/Time */}
                                  <div className="mt-1 text-xs text-gray-500">
                                    Erhalten: {new Date(reservation.created_at).toLocaleDateString('de-DE', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: '2-digit'
                                    })} um {new Date(reservation.created_at).toLocaleTimeString('de-DE', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })} Uhr
                                  </div>
                                  {reservation.special_requests && (
                                    <div className="mt-2 text-sm text-gray-600 bg-blue-50 p-2 rounded">
                                      <strong>{t('specialRequests')}:</strong> {reservation.special_requests}
                                    </div>
                                  )}
                                  {reservation.notes && (
                                    <div className="mt-2 text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                                      <strong>{t('internalNotes')}:</strong> {reservation.notes}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                {reservation.status === 'pending' && (
                                  <button
                                    onClick={() => updateReservation(reservation.id, { status: 'confirmed' })}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title={t('confirmReservationAction')}
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                )}
                                {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                                  <button
                                    onClick={() => sendConfirmationEmail(reservation.id)}
                                    disabled={sendingEmail === reservation.id || emailSentStatus[reservation.id]}
                                    className={`p-2 rounded-lg transition-colors ${
                                      emailSentStatus[reservation.id]
                                        ? 'text-green-600 bg-green-50 cursor-not-allowed opacity-75'
                                        : 'text-purple-600 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed'
                                    }`}
                                    title={emailSentStatus[reservation.id] ? 'E-Mail bereits versendet' : t('sendConfirmationEmailAction')}
                                  >
                                    {sendingEmail === reservation.id ? (
                                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-purple-600 border-t-transparent"></div>
                                    ) : emailSentStatus[reservation.id] ? (
                                      <CheckCircle className="w-4 h-4" />
                                    ) : (
                                      <Mail className="w-4 h-4" />
                                    )}
                                  </button>
                                )}
                                <button
                                  onClick={() => setEditingReservation(reservation.id)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title={t('editReservationAction')}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                {user?.role !== 'employee' && (
                                  <button
                                    onClick={() => deleteReservation(reservation.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title={t('deleteReservationAction')}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
                <button
                  onClick={() => setShowAddCategory(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {t('addCategory')}
                </button>
              </div>

              {showAddCategory && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('addNewCategory')}</h3>
                  <AddCategoryForm 
                    onSave={async (newCategory) => {
                      // Add category logic here
                      loadData()
                      setShowAddCategory(false)
                    }}
                    onCancel={() => setShowAddCategory(false)}
                  />
                </div>
              )}

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="grid gap-1">
                  {categories.map((category) => (
                    <div key={category.id} className="p-6 hover:bg-gray-50 transition-colors">
                      {editingCategory === category.id ? (
                        <CategoryEditor 
                          category={category} 
                          onSave={updateCategory} 
                          onCancel={() => setEditingCategory(null)} 
                        />
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                              {category.name_en.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{category.name_en}</h3>
                              <p className="text-gray-600">{category.name_de}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`inline-block px-2 py-1 text-xs rounded-full ${category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                  {category.is_active ? t('active') : t('inactive')}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {menuItems.filter(item => item.category_id === category.id).length} {t('items')}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingCategory(category.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title={t('editCategory')}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteCategory(category.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title={t('deleteCategory')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Menu Items Tab */}
          {activeTab === 'items' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Menu Items ({filteredAndSortedItems.length})</h2>
                <button
                  onClick={() => setShowAddItem(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {t('addItem')}
                </button>
              </div>

              {/* Search and Filter Controls */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder={t('searchItems')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Category Filter */}
                  <div>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">{t('allCategories')}</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name_en}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Availability Filter */}
                  <div>
                    <select
                      value={filterAvailable}
                      onChange={(e) => setFilterAvailable(e.target.value as 'all' | 'available' | 'unavailable')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">{t('allItems')}</option>
                      <option value="available">{t('availableOnly')}</option>
                      <option value="unavailable">{t('unavailableOnly')}</option>
                    </select>
                  </div>

                  {/* Sort Controls */}
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'category' | 'created')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="name">{t('sortByName')}</option>
                      <option value="price">{t('sortByPrice')}</option>
                      <option value="category">{t('sortByCategory')}</option>
                      <option value="created">{t('sortByCreated')}</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                    >
                      {sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Quick Filter Buttons */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setFilterCategory('all')
                      setFilterAvailable('all')
                      setSortBy('name')
                      setSortOrder('asc')
                    }}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    Clear All Filters
                  </button>
                  <button
                    onClick={() => setFilterAvailable('available')}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      filterAvailable === 'available'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Available Items
                  </button>
                  <button
                    onClick={() => {
                      const beverageCategories = categories.filter(cat =>
                        ['Beer', 'White Wine', 'Red Wine', 'Rosé Wine', 'Apple Wine', 'Spritz Variations', 'Spirits', 'Hot Beverages', 'Juices', 'Non-Alcoholic Beverages'].includes(cat.name_en)
                      )
                      if (beverageCategories.length > 0) {
                        setFilterCategory(beverageCategories[0].id)
                      }
                    }}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    Beverages
                  </button>
                  <button
                    onClick={() => {
                      const foodCategories = categories.filter(cat =>
                        ['Food', 'Vegetarian Dishes', 'Weekly Menu'].includes(cat.name_en)
                      )
                      if (foodCategories.length > 0) {
                        setFilterCategory(foodCategories[0].id)
                      }
                    }}
                    className="px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full hover:bg-orange-200 transition-colors"
                  >
                    Food
                  </button>
                </div>
              </div>

              {showAddItem && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Menu Item</h3>
                  <AddItemForm 
                    categories={categories}
                    onSave={async (newItem) => {
                      // Add item logic here
                      loadData()
                      setShowAddItem(false)
                    }}
                    onCancel={() => setShowAddItem(false)}
                  />
                </div>
              )}

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {filteredAndSortedItems.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-2">
                      <Search className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No items found</h3>
                    <p className="text-gray-500">
                      {searchTerm || filterCategory !== 'all' || filterAvailable !== 'all'
                        ? 'Try adjusting your search or filters'
                        : 'Add your first menu item to get started'
                      }
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Sortable Header */}
                    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                      <div className="grid grid-cols-12 gap-4 items-center text-sm font-medium text-gray-700">
                        <div className="col-span-4">
                          <button
                            onClick={() => handleSort('name')}
                            className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                          >
                            Item Name
                            {sortBy === 'name' && (
                              sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <div className="col-span-2">
                          <button
                            onClick={() => handleSort('category')}
                            className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                          >
                            Category
                            {sortBy === 'category' && (
                              sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <div className="col-span-1">
                          <button
                            onClick={() => handleSort('price')}
                            className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                          >
                            Price
                            {sortBy === 'price' && (
                              sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-3 text-right">{t('actions')}</div>
                      </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {filteredAndSortedItems.map((item) => (
                    <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                      {editingItem === item.id ? (
                        <MenuItemEditor 
                          item={item} 
                          categories={categories}
                          onSave={updateMenuItem} 
                          onCancel={() => setEditingItem(null)} 
                        />
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                              🍽️
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-semibold text-gray-900">{item.name_en}</h3>
                                <span className="text-lg font-bold text-green-600">€{item.price}</span>
                                {item.volume && (
                                  <span className="text-sm text-gray-600 bg-blue-50 px-2 py-1 rounded">
                                    {item.volume}
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm mb-2">{item.name_de}</p>
                              <div className="flex flex-wrap gap-1">
                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                  {item.categories.name_en}
                                </span>
                                {item.is_available && (
                                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Available</span>
                                )}
                                {item.is_popular && (
                                  <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">Popular</span>
                                )}
                                {item.is_vegetarian && (
                                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Vegetarian</span>
                                )}
                                {item.is_vegan && (
                                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Vegan</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateMenuItem(item.id, { is_available: !item.is_available })}
                              className={`p-2 rounded-lg transition-colors ${
                                item.is_available
                                  ? 'text-green-600 hover:bg-green-50'
                                  : 'text-gray-400 hover:bg-gray-50'
                              }`}
                              title={item.is_available ? 'Mark as unavailable' : 'Mark as available'}
                            >
                              {item.is_available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => setEditingItem(item.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit item"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteMenuItem(item.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Users Management Tab - Only for Admins */}
          {activeTab === 'users' && canAccessMenu && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Benutzer verwalten ({users.length})</h2>
                <button
                  onClick={() => {
                    setShowAddUser(true)
                    if (users.length === 0) loadUsers()
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Neuen Benutzer hinzufügen
                </button>
              </div>

              {loadingUsers ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Benutzer werden geladen...</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Benutzer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-Mail</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rolle</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Erstellt</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Letzter Login</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aktionen</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                              <div className="flex flex-col items-center">
                                <Users className="w-12 h-12 text-gray-300 mb-2" />
                                <p>Keine Benutzer gefunden</p>
                                <button 
                                  onClick={loadUsers}
                                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  Benutzer laden
                                </button>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          users.map((userData) => (
                            <tr key={userData.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                      <span className="text-blue-600 font-medium text-sm">
                                        {userData.name.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{userData.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{userData.email}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  userData.role === 'admin' 
                                    ? 'bg-red-100 text-red-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {userData.role === 'admin' ? 'Administrator' : 'Mitarbeiter'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(userData.created_at).toLocaleDateString('de-DE')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {userData.last_sign_in_at 
                                  ? new Date(userData.last_sign_in_at).toLocaleDateString('de-DE')
                                  : 'Noch nie'
                                }
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => setEditingUser(userData.id)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Benutzer bearbeiten"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  {userData.role !== 'admin' && (
                                    <button
                                      onClick={() => deleteUser(userData.id)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Benutzer löschen"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Add User Form */}
              {showAddUser && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Neuen Benutzer hinzufügen</h3>
                  <UserForm
                    onSave={createUser}
                    onCancel={() => setShowAddUser(false)}
                  />
                </div>
              )}

              {/* Edit User Form */}
              {editingUser && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Benutzer bearbeiten</h3>
                  <UserForm
                    user={users.find(u => u.id === editingUser)}
                    onSave={(userData) => updateUser(editingUser, userData)}
                    onCancel={() => setEditingUser(null)}
                    isEditing
                  />
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Calendar Day Popup Modal */}
      {showCalendarPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedCalendarDate && (() => {
                    // Parse the date string properly to avoid timezone issues
                    const [year, month, day] = selectedCalendarDate.split('-').map(Number);
                    const date = new Date(year, month - 1, day); // month is 0-indexed
                    return date.toLocaleDateString('de-DE', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    });
                  })()}
                </h3>
                <button
                  onClick={() => setShowCalendarPopup(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {isAddingFromCalendar ? (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Neue Reservierung hinzufügen</h4>
                  <AddReservationForm
                    initialDate={selectedCalendarDate || ''}
                    onSave={async (newReservation) => {
                      await loadReservations()
                      await loadAllReservations()
                      setShowCalendarPopup(false)
                    }}
                    onCancel={() => setShowCalendarPopup(false)}
                    isBackendForm={true} // Make email optional
                  />
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">
                      {calendarPopupReservations.length} Reservierung{calendarPopupReservations.length !== 1 ? 'en' : ''}
                    </h4>
                    <button
                      onClick={() => setIsAddingFromCalendar(true)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      + Hinzufügen
                    </button>
                  </div>

                  <div className="space-y-4">
                    {calendarPopupReservations
                      .sort((a, b) => a.reservation_time.localeCompare(b.reservation_time))
                      .map((reservation) => (
                        <div key={reservation.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                reservation.status === 'confirmed' ? 'bg-green-500' :
                                reservation.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'
                              }`}></div>
                              <span className="font-semibold text-gray-900">{reservation.name}</span>
                              <span className="text-sm font-medium text-blue-600">
                                {reservation.reservation_time.slice(0, 5)} Uhr
                              </span>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              reservation.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : reservation.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {reservation.status === 'confirmed' ? 'Bestätigt' :
                               reservation.status === 'pending' ? 'Ausstehend' :
                               reservation.status}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600 space-y-1 flex-1">
                              <div className="flex items-center space-x-4">
                                <span>👥 {reservation.guests} Gäste</span>
                                <span>📧 {reservation.email}</span>
                                <span>📞 {reservation.phone}</span>
                              </div>
                              {reservation.special_requests && (
                                <div className="text-blue-600">
                                  💬 {reservation.special_requests}
                                </div>
                              )}
                              <div className="text-xs text-gray-500">
                                Erhalten: {new Date(reservation.created_at).toLocaleDateString('de-DE')} um {new Date(reservation.created_at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2 ml-4">
                              {reservation.status === 'pending' && (
                                <button
                                  onClick={() => updateReservation(reservation.id, { status: 'confirmed' })}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Reservierung bestätigen"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                                <button
                                  onClick={() => sendConfirmationEmail(reservation.id)}
                                  disabled={sendingEmail === reservation.id || emailSentStatus[reservation.id]}
                                  className={`p-2 rounded-lg transition-colors ${
                                    emailSentStatus[reservation.id]
                                      ? 'text-green-600 bg-green-50 cursor-not-allowed opacity-75'
                                      : 'text-purple-600 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed'
                                  }`}
                                  title={emailSentStatus[reservation.id] ? 'E-Mail bereits gesendet' : 'Bestätigungs-E-Mail senden'}
                                >
                                  {sendingEmail === reservation.id ? (
                                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-purple-600 border-t-transparent"></div>
                                  ) : (
                                    <Mail className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Add Category Form Component
function AddCategoryForm({ 
  onSave, 
  onCancel 
}: { 
  onSave: (category: Omit<Category, 'id' | 'created_at'>) => Promise<void>
  onCancel: () => void 
}) {
  const [nameEn, setNameEn] = useState('')
  const [nameDe, setNameDe] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (!nameEn.trim() || !nameDe.trim()) return
    
    setIsLoading(true)
    try {
      const { error } = await (supabase as any)
        .from('categories')
        .insert([{
          name_en: nameEn.trim(),
          name_de: nameDe.trim(),
          is_active: isActive
        }])

      if (!error) {
        await onSave({ name_en: nameEn, name_de: nameDe, is_active: isActive })
      }
    } catch (error) {
      console.error('Error adding category:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">English Name</label>
          <input
            type="text"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="e.g., Appetizers"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">German Name</label>
          <input
            type="text"
            value={nameDe}
            onChange={(e) => setNameDe(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="e.g., Vorspeisen"
          />
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="newCategoryActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
        />
        <label htmlFor="newCategoryActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={isLoading || !nameEn.trim() || !nameDe.trim()}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          {isLoading ? 'Saving...' : 'Save Category'}
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2 transition-colors"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </div>
  )
}

// Add Item Form Component
function AddItemForm({ 
  categories,
  onSave, 
  onCancel 
}: { 
  categories: Category[]
  onSave: (item: Omit<MenuItem, 'id' | 'categories'>) => Promise<void>
  onCancel: () => void 
}) {
  const [nameEn, setNameEn] = useState('')
  const [nameDe, setNameDe] = useState('')
  const [descriptionEn, setDescriptionEn] = useState('')
  const [descriptionDe, setDescriptionDe] = useState('')
  const [price, setPrice] = useState('')
  const [volume, setVolume] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '')
  const [isAvailable, setIsAvailable] = useState(true)
  const [isPopular, setIsPopular] = useState(false)
  const [isVegetarian, setIsVegetarian] = useState(false)
  const [isVegan, setIsVegan] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (!nameEn.trim() || !nameDe.trim() || !price.trim() || !categoryId) return
    
    setIsLoading(true)
    try {
      const { error } = await (supabase as any)
        .from('menu_items')
        .insert([{
          name_en: nameEn.trim(),
          name_de: nameDe.trim(),
          description_en: descriptionEn.trim() || null,
          description_de: descriptionDe.trim() || null,
          price: parseFloat(price),
          volume: volume.trim() || null,
          category_id: categoryId,
          is_available: isAvailable,
          is_popular: isPopular,
          is_vegetarian: isVegetarian,
          is_vegan: isVegan
        }])

      if (!error) {
        await onSave({
          name_en: nameEn,
          name_de: nameDe,
          description_en: descriptionEn || null,
          description_de: descriptionDe || null,
          price: parseFloat(price),
          volume: volume || null,
          category_id: categoryId,
          is_available: isAvailable,
          is_popular: isPopular,
          is_vegetarian: isVegetarian,
          is_vegan: isVegan
        })
      }
    } catch (error) {
      console.error('Error adding item:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">English Name</label>
          <input
            type="text"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Grilled Salmon"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">German Name</label>
          <input
            type="text"
            value={nameDe}
            onChange={(e) => setNameDe(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Gegrillter Lachs"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">English Description</label>
          <textarea
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={2}
            placeholder="Optional description..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">German Description</label>
          <textarea
            value={descriptionDe}
            onChange={(e) => setDescriptionDe(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={2}
            placeholder="Optionale Beschreibung..."
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price (€)</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Volume</label>
          <input
            type="text"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 0,25l, 2cl, 330ml"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name_en}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="newItemAvailable"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="newItemAvailable" className="text-sm font-medium text-gray-700">Available</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="newItemPopular"
            checked={isPopular}
            onChange={(e) => setIsPopular(e.target.checked)}
            className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
          />
          <label htmlFor="newItemPopular" className="text-sm font-medium text-gray-700">Popular</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="newItemVegetarian"
            checked={isVegetarian}
            onChange={(e) => setIsVegetarian(e.target.checked)}
            className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="newItemVegetarian" className="text-sm font-medium text-gray-700">Vegetarian</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="newItemVegan"
            checked={isVegan}
            onChange={(e) => setIsVegan(e.target.checked)}
            className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="newItemVegan" className="text-sm font-medium text-gray-700">Vegan</label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={isLoading || !nameEn.trim() || !nameDe.trim() || !price.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          {isLoading ? 'Saving...' : 'Save Item'}
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2 transition-colors"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </div>
  )
}

// Category Editor Component
function CategoryEditor({ 
  category, 
  onSave, 
  onCancel 
}: { 
  category: Category
  onSave: (id: string, updates: Partial<Category>) => void
  onCancel: () => void 
}) {
  const [nameEn, setNameEn] = useState(category.name_en)
  const [nameDe, setNameDe] = useState(category.name_de)
  const [isActive, setIsActive] = useState(category.is_active)

  const handleSave = () => {
    onSave(category.id, {
      name_en: nameEn,
      name_de: nameDe,
      is_active: isActive
    })
  }

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">English Name</label>
          <input
            type="text"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">German Name</label>
          <input
            type="text"
            value={nameDe}
            onChange={(e) => setNameDe(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </div>
  )
}

// Menu Item Editor Component
function MenuItemEditor({ 
  item, 
  categories,
  onSave, 
  onCancel 
}: { 
  item: MenuItem
  categories: Category[]
  onSave: (id: string, updates: Partial<MenuItem>) => void
  onCancel: () => void 
}) {
  const [nameEn, setNameEn] = useState(item.name_en)
  const [nameDe, setNameDe] = useState(item.name_de)
  const [descriptionEn, setDescriptionEn] = useState(item.description_en || '')
  const [descriptionDe, setDescriptionDe] = useState(item.description_de || '')
  const [price, setPrice] = useState(item.price.toString())
  const [volume, setVolume] = useState(item.volume || '')
  const [categoryId, setCategoryId] = useState(item.category_id)
  const [isAvailable, setIsAvailable] = useState(item.is_available)
  const [isPopular, setIsPopular] = useState(item.is_popular)
  const [isVegetarian, setIsVegetarian] = useState(item.is_vegetarian)
  const [isVegan, setIsVegan] = useState(item.is_vegan)

  const handleSave = () => {
    onSave(item.id, {
      name_en: nameEn,
      name_de: nameDe,
      description_en: descriptionEn || null,
      description_de: descriptionDe || null,
      price: parseFloat(price),
      volume: volume || null,
      category_id: categoryId,
      is_available: isAvailable,
      is_popular: isPopular,
      is_vegetarian: isVegetarian,
      is_vegan: isVegan
    })
  }

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">English Name</label>
          <input
            type="text"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">German Name</label>
          <input
            type="text"
            value={nameDe}
            onChange={(e) => setNameDe(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">English Description</label>
          <textarea
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">German Description</label>
          <textarea
            value={descriptionDe}
            onChange={(e) => setDescriptionDe(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={2}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Price (€)</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Volume</label>
          <input
            type="text"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="e.g., 0,25l, 2cl, 330ml"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name_en}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isAvailable"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">Available</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPopular"
            checked={isPopular}
            onChange={(e) => setIsPopular(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="isPopular" className="text-sm font-medium text-gray-700">Popular</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isVegetarian"
            checked={isVegetarian}
            onChange={(e) => setIsVegetarian(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="isVegetarian" className="text-sm font-medium text-gray-700">Vegetarian</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isVegan"
            checked={isVegan}
            onChange={(e) => setIsVegan(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="isVegan" className="text-sm font-medium text-gray-700">Vegan</label>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </div>
  )
}

// Add Reservation Form Component
function AddReservationForm({
  onSave,
  onCancel,
  initialDate = '',
  isBackendForm = false
}: {
  onSave: (reservation: Omit<Reservation, 'id' | 'created_at' | 'updated_at' | 'confirmed_by' | 'confirmed_at' | 'confirmed_by_user'>) => Promise<void>
  onCancel: () => void
  initialDate?: string
  isBackendForm?: boolean
}) {
  // German translations for form
  const formT = (key: string) => {
    const translations: Record<string, string> = {
      'name': 'Name',
      'email': 'E-Mail',
      'phone': 'Telefon',
      'date': 'Datum',
      'time': 'Uhrzeit',
      'guests': 'Anzahl Gäste',
      'eventType': 'Veranstaltungstyp',
      'specialRequests': 'Besondere Wünsche',
      'notes': 'Notizen',
      'status': 'Status',
      'save': 'Speichern',
      'cancel': 'Abbrechen',
      'business': 'Geschäftstermin',
      'private': 'Private Feier',
      'celebration': 'Besondere Feier',
      'pending': 'Ausstehend',
      'confirmed': 'Bestätigt',
      'cancelled': 'Storniert',
      'completed': 'Abgeschlossen'
    }
    return translations[key] || key
  }
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState(initialDate)
  const [time, setTime] = useState('')
  const [guests, setGuests] = useState('')
  const [eventType, setEventType] = useState<Reservation['event_type']>('private')
  const [specialRequests, setSpecialRequests] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<Reservation['status']>('confirmed')
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    // For backend forms, email is optional
    const emailRequired = !isBackendForm
    if (!name.trim() || (emailRequired && !email.trim()) || !phone.trim() || !date || !time || !guests) return
    
    setIsLoading(true)
    try {
      const { data, error } = await (supabase as any)
        .from('reservations')
        .insert([{
          name: name.trim(),
          email: email.trim() || (isBackendForm ? 'info@efsane-events.de' : ''),
          phone: phone.trim(),
          reservation_date: date,
          reservation_time: time,
          guests: parseInt(guests),
          event_type: eventType,
          special_requests: specialRequests.trim() || null,
          notes: notes.trim() || null,
          status
        }])
        .select()
        .single()

      if (!error) {
        await onSave({
          name,
          email,
          phone,
          reservation_date: date,
          reservation_time: time,
          guests: parseInt(guests),
          event_type: eventType,
          special_requests: specialRequests || null,
          notes: notes || null,
          status
        })
      }
    } catch (error) {
      console.error('Error adding reservation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{formT('name')} *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Kundenname"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {formT('email')} {!isBackendForm && '*'}
            {isBackendForm && <span className="text-gray-500 text-xs">(optional für Telefonbuchungen)</span>}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={isBackendForm ? "Optional - leer lassen wenn nicht verfügbar" : "kunde@email.com"}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{formT('phone')} *</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Telefonnummer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{formT('date')} *</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{formT('time')} *</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{formT('guests')} *</label>
          <input
            type="number"
            min="1"
            max="300"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Anzahl Gäste"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{formT('eventType')}</label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value as Reservation['event_type'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="business">{formT('business')}</option>
            <option value="private">{formT('private')}</option>
            <option value="celebration">{formT('celebration')}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{formT('status')}</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Reservation['status'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="pending">{formT('pending')}</option>
            <option value="confirmed">{formT('confirmed')}</option>
            <option value="cancelled">{formT('cancelled')}</option>
            <option value="completed">{formT('completed')}</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{formT('specialRequests')}</label>
        <textarea
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={2}
          placeholder="Besondere Wünsche des Kunden..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{formT('notes')}</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={2}
          placeholder="Interne Notizen für das Personal..."
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={isLoading || !name.trim() || (!isBackendForm && !email.trim()) || !phone.trim() || !date || !time || !guests}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          {isLoading ? 'Speichern...' : formT('save')}
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2 transition-colors"
        >
          <X className="w-4 h-4" />
          {formT('cancel')}
        </button>
      </div>
    </div>
  )
}

// Reservation Editor Component
function ReservationEditor({ 
  reservation, 
  onSave, 
  onCancel 
}: { 
  reservation: Reservation
  onSave: (id: string, updates: Partial<Reservation>) => void
  onCancel: () => void 
}) {
  // German translations for editor form
  const editorT = (key: string) => {
    const translations: Record<string, string> = {
      'name': 'Name',
      'email': 'E-Mail',
      'phone': 'Telefon',
      'date': 'Datum',
      'time': 'Uhrzeit',
      'guests': 'Anzahl Gäste',
      'eventType': 'Veranstaltungstyp',
      'specialRequests': 'Besondere Wünsche',
      'notes': 'Notizen',
      'status': 'Status',
      'save': 'Speichern',
      'cancel': 'Abbrechen',
      'business': 'Geschäftstermin',
      'private': 'Private Feier',
      'celebration': 'Besondere Feier',
      'pending': 'Ausstehend',
      'confirmed': 'Bestätigt',
      'cancelled': 'Storniert',
      'completed': 'Abgeschlossen'
    }
    return translations[key] || key
  }
  const [name, setName] = useState(reservation.name)
  const [email, setEmail] = useState(reservation.email)
  const [phone, setPhone] = useState(reservation.phone)
  const [date, setDate] = useState(reservation.reservation_date)
  const [time, setTime] = useState(reservation.reservation_time)
  const [guests, setGuests] = useState(reservation.guests.toString())
  const [eventType, setEventType] = useState(reservation.event_type)
  const [specialRequests, setSpecialRequests] = useState(reservation.special_requests || '')
  const [notes, setNotes] = useState(reservation.notes || '')
  const [status, setStatus] = useState(reservation.status)

  const handleSave = () => {
    onSave(reservation.id, {
      name,
      email: email.trim() || 'info@efsane-events.de',
      phone,
      reservation_date: date,
      reservation_time: time,
      guests: parseInt(guests),
      event_type: eventType,
      special_requests: specialRequests || null,
      notes: notes || null,
      status
    })
  }

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{editorT('name')}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {editorT('email')} <span className="text-gray-500 text-xs">(optional)</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Optional - leer lassen wenn nicht verfügbar"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{editorT('phone')}</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{editorT('date')}</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{editorT('time')}</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{editorT('guests')}</label>
          <input
            type="number"
            min="1"
            max="300"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{editorT('eventType')}</label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value as Reservation['event_type'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="business">{editorT('business')}</option>
            <option value="private">{editorT('private')}</option>
            <option value="celebration">{editorT('celebration')}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{editorT('status')}</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Reservation['status'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="pending">{editorT('pending')}</option>
            <option value="confirmed">{editorT('confirmed')}</option>
            <option value="cancelled">{editorT('cancelled')}</option>
            <option value="completed">{editorT('completed')}</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{editorT('specialRequests')}</label>
        <textarea
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{editorT('internalNotes')}</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={2}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          {editorT('save')}
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center gap-2 transition-colors"
        >
          <X className="w-4 h-4" />
          {editorT('cancel')}
        </button>
      </div>
    </div>
  )
}

// User Form Component
function UserForm({ 
  user,
  onSave, 
  onCancel,
  isEditing = false
}: { 
  user?: any
  onSave: (userData: { email: string, password?: string, name: string, role: string }) => Promise<void>
  onCancel: () => void 
  isEditing?: boolean
}) {
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [name, setName] = useState(user?.name || '')
  const [role, setRole] = useState(user?.role || 'employee')
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (!email.trim() || !name.trim() || (!isEditing && !password.trim())) return
    
    setIsLoading(true)
    try {
      const userData: any = {
        email: email.trim(),
        name: name.trim(),
        role
      }
      
      if (password.trim()) {
        userData.password = password
      }
      
      await onSave(userData)
    } catch (error) {
      console.error('Error saving user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Vollständiger Name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="benutzer@efsane-events.de"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passwort {isEditing ? '(leer lassen = nicht ändern)' : '*'}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={isEditing ? "Neues Passwort" : "Passwort"}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rolle *</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="employee">Mitarbeiter (nur Reservierungen)</option>
            <option value="admin">Administrator (Vollzugriff)</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={handleSave}
          disabled={isLoading || !email.trim() || !name.trim() || (!isEditing && !password.trim())}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          {isLoading ? 'Speichern...' : (isEditing ? 'Änderungen speichern' : 'Benutzer erstellen')}
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2 transition-colors"
        >
          <X className="w-4 h-4" />
          Abbrechen
        </button>
      </div>
    </div>
  )
}

export default AdminDashboard