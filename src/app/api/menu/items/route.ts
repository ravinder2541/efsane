import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');
    const search = searchParams.get('search');
    const vegetarian = searchParams.get('vegetarian');
    const popular = searchParams.get('popular');

    let query = supabase
      .from('menu_items')
      .select(`
        *,
        categories (
          id,
          name_de,
          name_en,
          description_de,
          description_en
        )
      `)
      .eq('is_available', true)
      .order('sort_order', { ascending: true });

    // Filter by category if specified
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    // Filter by search term if specified
    if (search) {
      query = query.or(`name_de.ilike.%${search}%,name_en.ilike.%${search}%,description_de.ilike.%${search}%,description_en.ilike.%${search}%`);
    }

    // Filter by vegetarian if specified
    if (vegetarian === 'true') {
      query = query.eq('is_vegetarian', true);
    }

    // Filter by popular if specified
    if (popular === 'true') {
      query = query.eq('is_popular', true);
    }

    const { data: menuItems, error } = await query;

    if (error) {
      console.error('Error fetching menu items:', error);
      return NextResponse.json(
        { error: 'Failed to fetch menu items' },
        { status: 500 }
      );
    }

    return NextResponse.json({ menuItems });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}