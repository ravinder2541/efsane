export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name_de: string
          name_en: string
          description_de: string | null
          description_en: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name_de: string
          name_en: string
          description_de?: string | null
          description_en?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name_de?: string
          name_en?: string
          description_de?: string | null
          description_en?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      menu_items: {
        Row: {
          id: string
          category_id: string
          name_de: string
          name_en: string
          description_de: string | null
          description_en: string | null
          price: number
          image_url: string | null
          allergens: string[] | null
          is_vegetarian: boolean
          is_vegan: boolean
          is_gluten_free: boolean
          is_spicy: boolean
          is_popular: boolean
          is_available: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name_de: string
          name_en: string
          description_de?: string | null
          description_en?: string | null
          price: number
          image_url?: string | null
          allergens?: string[] | null
          is_vegetarian?: boolean
          is_vegan?: boolean
          is_gluten_free?: boolean
          is_spicy?: boolean
          is_popular?: boolean
          is_available?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name_de?: string
          name_en?: string
          description_de?: string | null
          description_en?: string | null
          price?: number
          image_url?: string | null
          allergens?: string[] | null
          is_vegetarian?: boolean
          is_vegan?: boolean
          is_gluten_free?: boolean
          is_spicy?: boolean
          is_popular?: boolean
          is_available?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'manager' | 'editor'
          is_active: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: 'admin' | 'manager' | 'editor'
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'manager' | 'editor'
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'manager' | 'editor'
    }
  }
}

// Convenience types
export type Category = Database['public']['Tables']['categories']['Row']
export type MenuItem = Database['public']['Tables']['menu_items']['Row']
export type AdminUser = Database['public']['Tables']['admin_users']['Row']

export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type MenuItemInsert = Database['public']['Tables']['menu_items']['Insert']
export type AdminUserInsert = Database['public']['Tables']['admin_users']['Insert']

export type CategoryUpdate = Database['public']['Tables']['categories']['Update']
export type MenuItemUpdate = Database['public']['Tables']['menu_items']['Update']
export type AdminUserUpdate = Database['public']['Tables']['admin_users']['Update']

// Menu display types for frontend
export interface MenuCategoryWithItems extends Category {
  menu_items: MenuItem[]
}

export interface MenuData {
  categories: MenuCategoryWithItems[]
  lastUpdated: string
  totalItems: number
  totalCategories: number
}