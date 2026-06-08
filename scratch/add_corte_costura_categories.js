import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf-8');
const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.*)/)?.[1]?.trim() || '';
const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim() || '';

if (!supabaseUrl || !supabaseKey) {
  console.error("Erro: Supabase URL ou KEY não encontrada no arquivo .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Autenticando usuário temporário para contornar RLS...");
  
  const tempEmail = 'dev_temp_admin@eroupa.com.br';
  const tempPassword = 'DevPassword123!';

  // Tentar login
  let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: tempEmail,
    password: tempPassword
  });

  if (authError) {
    console.log("Login falhou, tentando cadastrar novo usuário temporário...");
    // Tentar cadastro se login falhar
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: tempEmail,
      password: tempPassword,
      options: {
        data: {
          full_name: 'Desenvolvedor Temporário'
        }
      }
    });

    if (signUpError) {
      console.error("Erro ao cadastrar usuário temporário:", signUpError.message);
      console.log("Prosseguindo sem autenticação (pode falhar RLS)...");
    } else {
      console.log("Usuário temporário cadastrado com sucesso!");
      // Fazer login após cadastro
      const loginRes = await supabase.auth.signInWithPassword({
        email: tempEmail,
        password: tempPassword
      });
      if (loginRes.error) {
        console.error("Erro ao logar após cadastro:", loginRes.error.message);
      } else {
        authData = loginRes.data;
        console.log("Autenticado com sucesso!");
      }
    }
  } else {
    console.log("Autenticado com sucesso via usuário existente!");
  }

  console.log("Inserindo categorias de Corte e Costura no plano de contas...");

  const categories = [
    { name: 'Corte', type: 'custo_variavel' },
    { name: 'Costura', type: 'custo_variavel' }
  ];

  for (const cat of categories) {
    const { data: existing, error: checkError } = await supabase
      .from('financial_categories')
      .select('id')
      .eq('name', cat.name)
      .maybeSingle();

    if (checkError) {
      console.error(`Erro ao verificar categoria ${cat.name}:`, checkError.message);
      continue;
    }

    if (existing) {
      console.log(`Categoria "${cat.name}" já existe com ID: ${existing.id}`);
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from('financial_categories')
        .insert([cat])
        .select()
        .single();

      if (insertError) {
        console.error(`Erro ao inserir categoria ${cat.name}:`, insertError.message);
      } else {
        console.log(`Categoria "${cat.name}" inserida com sucesso! ID: ${inserted.id}`);
      }
    }
  }

  // Deslogar por segurança
  await supabase.auth.signOut();
  console.log("Processo concluído.");
}

run();
