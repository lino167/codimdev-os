'use server'

import { createClient } from '@supabase/supabase-js'

// Inicializa o cliente do Supabase com fallback resiliente para ambiente local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey 

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function submitAuditForm(formData: FormData) {
  try {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const company = formData.get('company') as string
    const budget = formData.get('budget') as string
    const phone = formData.get('phone') as string

    // Inserção direta na tabela 'leads'
    const { data, error } = await supabase
      .from('leads')
      .insert([
        { 
          name, 
          email, 
          company, 
          budget: budget ? parseFloat(budget) : null,
          phone,
          source: 'audit_form',
          status: 'new'
        }
      ])

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Erro na Inserção do Lead:', error)
    return { success: false, error: 'Falha ao processar auditoria técnica.' }
  }
}
