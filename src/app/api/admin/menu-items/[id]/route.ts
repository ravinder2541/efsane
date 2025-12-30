import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const data = await request.json();
    
    const { data: menuItem, error } = await (supabaseAdmin as any)
      .from('menu_items')
      .update(data)
      .eq('id', params.id)
      .select('*, categories(*)')
      .single();

    if (error) throw error;
    return NextResponse.json({ menuItem });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    
    const { error } = await supabaseAdmin
      .from('menu_items')
      .delete()
      .eq('id', params.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete menu it  ' }, { status: 500 });
  }
}
