import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://padphoedldbbqiwuxlnm.supabase.co";
const supabaseKey = "sb_publishable_b5yMHcmNWIqwLrUalrelUQ_xGk4JjX3"; // Anon key local

const supabase = createClient(supabaseUrl, supabaseKey);

async function sendTelemetryLog() {
  console.log("🚀 INICIANDO DISPARO DE TELEMETRIA LOCAL...");
  
  const logData = {
    name: "Antigravity IDE: Novo Deploy do Kraflo CMMS",
    status: "success",
    payload: {
      origem: "Antigravity_IDE_Terminal",
      versao: "v1.4.12",
      commit: "f8d167a",
      deployed_by: "Zacarias_Ramos_Operator",
      ambiente: "desenvolvimento"
    },
    execution_time_ms: 84
  };

  try {
    const { error } = await supabase
      .from("automations_log")
      .insert([logData]);

    if (error) throw error;

    console.log("✅ TELEMETRIA DISPARADA COM SUCESSO!");
    console.log("SISTEMA OPERACIONAL: Registro sincronizado no banco de dados.");
  } catch (err) {
    console.error("❌ ERRO NO DISPARO DA TELEMETRIA:", err.message || err);
  }
}

sendTelemetryLog();
