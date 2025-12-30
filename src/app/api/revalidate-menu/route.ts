import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    // Revalidate both German and English menu pages
    revalidatePath('/menu')
    revalidatePath('/speisekarte')
    
    console.log('✅ Menu pages revalidated successfully')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Menu pages revalidated successfully' 
    })
  } catch (error) {
    console.error('❌ Error revalidating menu pages:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to revalidate menu pages',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}