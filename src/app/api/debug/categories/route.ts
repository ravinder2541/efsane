import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Fetch all categories with their status
    const { data: allCategories, error: allError } = await supabase
      .from('categories')
      .select('id, name_de, name_en, is_active')
      .order('name_en')

    // Fetch only active categories (what the frontend sees)
    const { data: activeCategories, error: activeError } = await supabase
      .from('categories')
      .select('id, name_de, name_en, is_active')
      .eq('is_active', true)
      .order('name_en')

    if (allError || activeError) {
      throw new Error(allError?.message || activeError?.message)
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      all_categories: allCategories,
      active_categories: activeCategories,
      summary: {
        total_categories: allCategories?.length || 0,
        active_categories: activeCategories?.length || 0,
        inactive_categories: (allCategories?.length || 0) - (activeCategories?.length || 0)
      }
    })
  } catch (error) {
    console.error('Error fetching category status:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch category status',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}