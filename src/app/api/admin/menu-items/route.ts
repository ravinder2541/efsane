import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: menuItems, error } = await supabaseAdmin
      .from('menu_items')
      .select('*, categories(*)')
      .order('sort_order');

    if (error) throw error;
    return NextResponse.json({ menuItems });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { data: menuItem, error } = await supabaseAdmin
      .from('menu_items')
      .insert(data)
      .select('*, categories(*)')
      .single();

    if (error) throw error;
    return NextResponse.json({ menuItem }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}
