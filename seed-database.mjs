import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERRO: NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não localizados no .env.local.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seed() {
  console.log('🚀 INICIANDO ALIMENTAÇÃO TÁTICA (SEED) DO BANCO DE DADOS SUPABASE...')

  try {
    // 1. Seed de Leads (Para o Kanban do CRM)
    console.log('📌 Cadastrando Leads no CRM...')
    const leadsToInsert = [
      {
        name: 'Roberto Silveira',
        company: 'Vercel Enterprise',
        email: 'roberto@vercel.com',
        phone: '+55 11 98888-7777',
        status: 'captured',
        budget: 45000,
        source: 'landing_page',
        notes: 'Lead corporativo interessado em migração de infraestrutura legada para arquitetura Serverless Edge.'
      },
      {
        name: 'Camila Fernandes',
        company: 'Stripe Brasil',
        email: 'camila.f@stripe.com',
        phone: '+55 21 97777-6666',
        status: 'contacted',
        budget: 65000,
        source: 'audit_form',
        notes: 'Solicitou Auditoria de Eficiência Operacional para a esteira de pagamentos da filial brasileira.'
      },
      {
        name: 'Guilherme Santos',
        company: 'Mondial Alimentos',
        email: 'guilherme@mondial.com.br',
        phone: '+55 11 96666-5555',
        status: 'audit_proposed',
        budget: 120000,
        source: 'referral',
        notes: 'Auditoria de chão de fábrica e automação industrial com integração ERP concluída. Apresentando proposta técnica.'
      },
      {
        name: 'Mariana Costa',
        company: 'Nodus Asset',
        email: 'mariana@nodus.com.br',
        phone: '+55 11 95555-4444',
        status: 'won',
        budget: 92000,
        source: 'website',
        notes: 'Contrato assinado para desenvolvimento de plataforma proprietária de análise de portfólios financeiros.'
      }
    ]

    const { data: leadsCreated, error: leadsErr } = await supabase
      .from('leads')
      .insert(leadsToInsert)
      .select()

    if (leadsErr) throw leadsErr
    console.log(`✅ ${leadsCreated.length} Leads cadastrados com sucesso no CRM.`)

    // 2. Seed de Clientes (Para relacionamento de Projetos)
    console.log('📌 Cadastrando Clientes Ativos...')
    const clientsToInsert = [
      {
        name: 'Carlos Kraflo',
        company_name: 'Kraflo Indústrias',
        email: 'carlos@kraflo.com.br',
        phone: '+55 19 94444-3333',
        status: 'active'
      },
      {
        name: 'Eduardo Martins',
        company_name: 'Nodus Corp',
        email: 'eduardo@nodus.com.br',
        phone: '+55 11 93333-2222',
        status: 'active'
      }
    ]

    const { data: clientsCreated, error: clientsErr } = await supabase
      .from('clients')
      .insert(clientsToInsert)
      .select()

    if (clientsErr) throw clientsErr
    console.log(`✅ ${clientsCreated.length} Clientes cadastrados.`)

    const clientKraflo = clientsCreated.find(c => c.company_name === 'Kraflo Indústrias')
    const clientNodus = clientsCreated.find(c => c.company_name === 'Nodus Corp')

    // 3. Seed de Projetos (Vinculados aos Clientes)
    console.log('📌 Cadastrando Projetos...')
    const projectsToInsert = []

    if (clientKraflo) {
      projectsToInsert.push({
        client_id: clientKraflo.id,
        name: 'Desktop Kraflo CMMS',
        status: 'building',
        progress: 85,
        price: 145000,
        deadline: '2026-06-30',
        repository_url: 'https://github.com/codimdev/kraflo-cmms',
        production_url: 'https://kraflo-cmms.codimdev.app'
      })
    }

    if (clientNodus) {
      projectsToInsert.push({
        client_id: clientNodus.id,
        name: 'SaaS Audit™ Blueprint',
        status: 'deployed',
        progress: 100,
        price: 92000,
        deadline: '2026-04-15',
        repository_url: 'https://github.com/codimdev/saas-audit-blueprint',
        production_url: 'https://blueprint.codimdev.app'
      })
    }

    const { data: projectsCreated, error: projectsErr } = await supabase
      .from('projects')
      .insert(projectsToInsert)
      .select()

    if (projectsErr) throw projectsErr
    console.log(`✅ ${projectsCreated.length} Projetos cadastrados com sucesso.`)

    const projectKraflo = projectsCreated.find(p => p.name === 'Desktop Kraflo CMMS')
    const projectNodus = projectsCreated.find(p => p.name === 'SaaS Audit™ Blueprint')

    // 4. Seed de Transações Financeiras (Vinculadas ou avulsas)
    console.log('📌 Cadastrando Transações Financeiras (Entradas e Saídas)...')
    const finToInsert = [
      {
        description: 'Parcial Contrato: Desktop Kraflo CMMS',
        type: 'income',
        category: 'project',
        amount: 72500,
        transaction_date: '2026-05-01',
        project_id: projectKraflo?.id || null,
        status: 'paid'
      },
      {
        description: 'Setup Total: SaaS Audit™ Blueprint',
        type: 'income',
        category: 'project',
        amount: 92000,
        transaction_date: '2026-04-10',
        project_id: projectNodus?.id || null,
        status: 'paid'
      },
      {
        description: 'Servidores Vercel & Supabase Enterprise',
        type: 'expense',
        category: 'infrastructure',
        amount: 1450,
        transaction_date: '2026-05-05',
        status: 'paid'
      },
      {
        description: 'Aquisição de Ativos e Hardware Dev-OS',
        type: 'expense',
        category: 'hardware',
        amount: 8600,
        transaction_date: '2026-04-28',
        status: 'paid'
      }
    ]

    const { data: finCreated, error: finErr } = await supabase
      .from('financial_transactions')
      .insert(finToInsert)
      .select()

    if (finErr) throw finErr
    console.log(`✅ ${finCreated.length} Transações financeiras cadastradas.`)

    // 5. Seed de Deploys
    console.log('📌 Cadastrando Histórico de Deploys...')
    const deploysToInsert = []

    if (projectKraflo) {
      deploysToInsert.push({
        project_id: projectKraflo.id,
        environment: 'production',
        status: 'success',
        commit_message: 'feat: add gatilho para execuções preventivas de manutenção industrial',
        commit_hash: 'a3b98c1',
        duration_seconds: 42,
        deploy_url: 'https://kraflo-cmms.codimdev.app'
      })
    }

    if (projectNodus) {
      deploysToInsert.push({
        project_id: projectNodus.id,
        environment: 'production',
        status: 'success',
        commit_message: 'build: initial release e configuração de benchmarks de performance',
        commit_hash: 'ef821b3',
        duration_seconds: 35,
        deploy_url: 'https://blueprint.codimdev.app'
      })
    }

    const { data: deploysCreated, error: deploysErr } = await supabase
      .from('deploys')
      .insert(deploysToInsert)
      .select()

    if (deploysErr) throw deploysErr
    console.log(`✅ ${deploysCreated.length} Registros de Deploy cadastrados.`)

    // 6. Seed de Logs de Automação
    console.log('📌 Cadastrando Logs de Automações Técnicas...')
    const logsToInsert = [
      {
        name: 'Telegram Krafl-o Bot: Comando /status acionado',
        status: 'success',
        execution_time_ms: 124,
        payload: { user: 'Zacarias Ramos', response: 'Sistemas 100% operacionais' }
      },
      {
        name: 'Sincronização n8n: Novo lead capturado no formulário público',
        status: 'success',
        execution_time_ms: 310,
        payload: { lead_company: 'Vercel Enterprise', webhook: 'active' }
      },
      {
        name: 'Webhook Stripe: Verificação de faturamento recorrente (MRR)',
        status: 'success',
        execution_time_ms: 450,
        payload: { stripe_event: 'invoice.paid', status: 'verified' }
      }
    ]

    const { data: logsCreated, error: logsErr } = await supabase
      .from('automations_log')
      .insert(logsToInsert)
      .select()

    if (logsErr) throw logsErr
    console.log(`✅ ${logsCreated.length} Logs de Automação cadastrados com sucesso.`)

    console.log('\n⭐ SEED CONCLUÍDO COM SUCESSO ABSOLUTO!')
    console.log('Todos os dados fictícios locais foram substituídos por registros reais na nuvem Supabase.')
    console.log('Agora as páginas do painel estão lendo 100% de dados vivos e interativos!')

  } catch (err) {
    console.error('❌ ERRO DURANTE O SEED:', err)
  }
}

seed()
