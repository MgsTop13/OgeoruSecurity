import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { conexao } from "./conections.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function enviarMensagem(texto) {
  try {
    console.log('🤖 Iniciando análise do Gemini...');
    console.log('📝 Texto a ser analisado (primeiros 500 caracteres):', texto.substring(0, 500));
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Você é um analisador de segurança de arquivos (script/texto). Regras:
      1. Analise apenas o conteúdo textual e verifique se contém **comandos executáveis, trechos de script, ou padrões de instrução** que possam executar ou destruir dados quando rodados (ex.: comandos del, rm -rf, FORMAT, Remove-Item -Recurse -Force, shutdown, cmd.exe, .exe, PowerShell, etc.).
      2. **Classifique** estritamente em duas saídas possíveis:
        - Se houver comandos/executáveis detectáveis ou código perigoso: responda **exatamente** 'Perigoso — <motivo em no máximo 1 linha>'.
        - Se NÃO houver comandos/executáveis (mesmo que haja uma frase de ameaça casual como "vou deletar tudo, hahaha"): responda **exatamente** Inofensivo.
      3. O motivo quando "Perigoso" deve ser direto e em **uma linha curta** citando o padrão detectado (ex.: "contém 'rm -rf /' que apaga recursivamente arquivos").
      4. Ignore linguagem de ódio, sarcasmo ou ameaças verbais que não contenham instruções executáveis — trate-as como 'Inofensivo'.
      5. Seja objetivo; **nenhum texto adicional** além da saída obrigatória acima.

      Exemplos (entrada → saída):
      - "DEL /F /S /Q C:\\ "  → Perigoso — contém 'DEL /F /S /Q' que deleta arquivos recursivamente.
      - "rm -rf /" → Perigoso — contém 'rm -rf /' que remove recursivamente do root.
      - "Eu irei deletar tudo que eu vejo pela frente, hahahaha" → Inofensivo
      - "Remove-Item -Path C:\\\\ -Recurse -Force" → Perigoso — contém 'Remove-Item -Recurse -Force' (PowerShell) que apaga arquivos.
      Agora analise apenas o texto a seguir e responda conforme as regras: 
      <<${texto}>>
    `;

    const result = await model.generateContent(prompt);
    const resposta = result.response.text();
    
    console.log('✅ Resposta do Gemini:', resposta);
    return resposta;

  } catch (error) {
    console.error('❌ Erro no Gemini:', error);
    
    // Fallback em caso de erro no Gemini
    if (error.message.includes('API_KEY') || error.message.includes('quota')) {
      return 'Erro: Problema com a API do Gemini. Tente novamente mais tarde.';
    }
    
    return 'Erro na análise do arquivo. Tente novamente.';
  }
}

// ... resto das funções mantém igual

// Funções específicas para limites de ARQUIVOS
export async function verificarLimiteArquivo(email) {
  const command = `
      SELECT maxArquivo 
      FROM cadastro 
      WHERE email = ?
  `;
  
  const [rows] = await conexao.query(command, [email]);
  return rows[0];
}

export async function decrementarLimiteArquivo(email) {
  const command = `
      UPDATE cadastro 
      SET maxArquivo = maxArquivo - 1 
      WHERE email = ? AND maxArquivo > 0
  `;
  
  const [result] = await conexao.query(command, [email]);
  return result.affectedRows > 0;
}

// Função para buscar usuário por email
export async function buscarUsuarioPorEmail(email) {
  const command = `
      SELECT id_cadastro, nome, email, maxArquivo 
      FROM cadastro 
      WHERE email = ?
  `;
  
  const [rows] = await conexao.query(command, [email]);
  return rows[0];
}