import * as ArquivoRepository from "../repository/ArquivoRepository.js"
import * as LinkRepository from "../repository/LinkRepository.js"

import { Router } from "express";
import axios from "axios";

const endpoint = Router();

// Analise de URL offline
function minhaAnaliseManual(url) {
  const resultado = {
    pontosRisco: 0,
    alertas: [],
    MuySuspeito: false
  };

  // Caso se o link for um IP 
  if (url.includes('192.168.') || url.includes('10.') || url.includes('172.')) {
    resultado.pontosRisco += 25;
    resultado.alertas.push('Site feito localmente');
  }

  // Sites que tentam se aplicar com o original
  const sitesFalsos = ['g00gle', 'facebok', 'micr0soft', 'paypa1', 'amaz0n', 'g0v', 'index'];
  if (sitesFalsos.some(site => url.toLowerCase().includes(site))) {
    resultado.pontosRisco += 30;
    resultado.alertas.push('Imita sites famosos');
  }

  // Sites com downloads perigosos
  const extensoesPerigosas = ['.exe', '.bat', '.msi', '.jar', '.scr'];
  if (extensoesPerigosas.some(extensao => url.toLowerCase().includes(extensao))) {
    resultado.pontosRisco += 35;
    resultado.alertas.push('Download de arquivos perigosos');
  }

  // Urls com palavras de capturação de dados
  const palavrasSuspeitas = ['login', 'senha', 'password', 'conta', 'banking'];
  if (palavrasSuspeitas.some(palavra => url.toLowerCase().includes(palavra))) {
    resultado.pontosRisco += 10;
    resultado.alertas.push('Pode roubar dados');
  }

  resultado.MuySuspeito = resultado.pontosRisco > 20;
  return resultado;
}

async function verificarComGoogle(url, apiKey) {
  try {
    const payload = {
      client: {
        clientId: "meu-tcc",
        clientVersion: "1.0.0"
      },
      threatInfo: {
        threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
        platformTypes: ["ANY_PLATFORM"],
        threatEntryTypes: ["URL"],
        threatEntries: [{ url }]
      }
    };

    const response = await axios.post(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
      payload,
      { 
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      }
    );

    return {
      seguro: !response.data.matches || response.data.matches.length === 0,
      ameacas: response.data.matches || []
    };

  } catch (error) {
    return {
      seguro: true,
      ameacas: [],
      erro: 'Google indisponível'
    };
  }
}

endpoint.post('/check-url', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ 
        error: 'URL é obrigatória',
        example: { "url": "https://example.com" }
      });
    }

    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({
        error: 'URL inválida',
        message: 'Use formato: https://exemplo.com'
      });
    }

    const API_KEY = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
    
    const [resultadoGoogle, minhaAnalise] = await Promise.all([
      API_KEY ? verificarComGoogle(url, API_KEY) : Promise.resolve({ seguro: true, ameacas: [] }),
      Promise.resolve(minhaAnaliseManual(url))
    ]);

    const urlSegura = resultadoGoogle.seguro && !minhaAnalise.MuySuspeito;

    res.json({
      url: url,
      segura: urlSegura,
      timestamp: new Date().toISOString(),
      
      detalhes: {
        google: {
          segura: resultadoGoogle.seguro,
          ameacas: resultadoGoogle.ameacas
        },
        minhaAnalise: {
          pontosRisco: minhaAnalise.pontosRisco,
          alertas: minhaAnalise.alertas,
          MuySuspeito: minhaAnalise.MuySuspeito
        }
      },

      recomendacao: urlSegura ? 
        '✅ URL segura - pode acessar' : 
        '🚨 PERIGO - Evite este site!'
    });

  } catch (error) {
    console.error('Erro na verificação:', error);
    
    if (error.response) {
      res.status(error.response.status).json({
        error: 'Erro no serviço do Google',
        details: error.response.data
      });
    } else {
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error.message 
      });
    }
  }
});

// ENDPOINTS DE INFO
endpoint.get('/', (req, res) => {
  res.json({ 
    message: 'Bem-vindo à API Safe Browsing!',
    documentation: 'Acesse /api/info para ver os endpoints'
  });
});

endpoint.get('/info', (req, res) => {
  res.json({
    endpoints: {
      '/api/check-url': 'POST - Verificar uma URL (sem limite)',
      '/api/check-url-com-limite': 'POST - Verificação com limite',
      '/api/health': 'GET - Status da API',
      '/api/quick-check': 'POST - Verificação Rápida',
      '/api/VerificarLimiteLink/:email': 'GET - Verificar limite do usuário'
    }
  });
});

endpoint.get('/health', (req, res) => {
  res.json({ 
    status: 'online', 
    timestamp: new Date().toISOString()
  });
});

endpoint.post('/quick-check', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL é obrigatória' });
    }

    const minhaAnalise = minhaAnaliseManual(url);

    res.json({
      url: url,
      segura: !minhaAnalise.MuySuspeito,
      pontosRisco: minhaAnalise.pontosRisco,
      alertas: minhaAnalise.alertas,
      nivelRisco: minhaAnalise.pontosRisco > 40 ? 'ALTO' : 
                 minhaAnalise.pontosRisco >= 20 ? 'MÉDIO' : 'BAIXO',
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Erro na verificação',
      message: error.message 
    });
  }
});




// Middleware para verificar limite de links
async function verificarLimiteLink(req, res, next) {
    const { email, nome } = req.body;
    
    // Se não tem email, tenta buscar por nome
    let usuarioEmail = email;
    
    if (!usuarioEmail && nome) {
        try {
            const usuario = await LinkRepository.buscarUsuarioPorNome(nome);
            if (usuario) {
                usuarioEmail = usuario.email;
            }
        } catch (error) {
            console.error('Erro ao buscar usuário por nome:', error);
        }
    }
    
    if (!usuarioEmail) {
        return res.status(400).send({ error: "Email ou nome são obrigatórios" });
    }

    try {
        const usuario = await LinkRepository.verificarLimiteLink(usuarioEmail);
        
        if (!usuario) {
            return res.status(404).send({ error: "Usuário não encontrado" });
        }

        // Verifica se tem limite disponível
        if (usuario.maxLink <= 0) {
            return res.status(402).send({ 
                error: "Limite de verificações atingido",
                tipo: "LIMITE_ATINGIDO",
                mensagem: "Você atingiu o limite de verificações gratuitas. Faça o pagamento para continuar."
            });
        }

        req.usuario = usuario;
        req.usuarioEmail = usuarioEmail;
        next();
    } catch (error) {
        console.error('Erro ao verificar limite de link:', error);
        res.status(500).send({ error: "Erro interno do servidor" });
    }
}



// ENDPOINT PRINCIPAL COM LIMITE
endpoint.post('/check-url-com-limite', verificarLimiteLink, async (req, res) => {
  try {
    const { url, email, nome } = req.body;

    // Validações básicas
    if (!url) {
      return res.status(400).json({ 
        error: 'URL é obrigatória',
        example: { "url": "https://example.com" }
      });
    }

    // Verifica se URL é válida
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({
        error: 'URL inválida',
        message: 'Use formato: https://exemplo.com'
      });
    }

    // Decrementar o limite
    const decrementado = await LinkRepository.decrementarLimiteLink(req.usuarioEmail);
    if (!decrementado) {
      return res.status(402).send({ 
        error: "Erro ao atualizar limite",
        tipo: "ERRO_LIMITE"
      });
    }

    const API_KEY = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
    
    const [resultadoGoogle, minhaAnalise] = await Promise.all([
      API_KEY ? verificarComGoogle(url, API_KEY) : Promise.resolve({ seguro: true, ameacas: [] }),
      Promise.resolve(minhaAnaliseManual(url))
    ]);

    // Combina os resultados
    const urlSegura = resultadoGoogle.seguro && !minhaAnalise.MuySuspeito;

    // Obter o novo limite atualizado
    const usuarioAtualizado = await LinkRepository.verificarLimiteLink(req.usuarioEmail);

    // RESPOSTA FINAL
    res.json({
      url: url,
      segura: urlSegura,
      timestamp: new Date().toISOString(),
      limiteRestante: usuarioAtualizado.maxLink,
      
      detalhes: {
        google: {
          segura: resultadoGoogle.seguro,
          ameacas: resultadoGoogle.ameacas
        },
        minhaAnalise: {
          pontosRisco: minhaAnalise.pontosRisco,
          alertas: minhaAnalise.alertas,
          MuySuspeito: minhaAnalise.MuySuspeito
        }
      },

      recomendacao: urlSegura ? 
        '✅ URL segura - pode acessar' : 
        '🚨 PERIGO - Evite este site!'
    });

  } catch (error) {
    console.error('Erro na verificação:', error);
    
    if (error.response) {
      res.status(error.response.status).json({
        error: 'Erro no serviço de verificação',
        details: error.response.data
      });
    } else {
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error.message 
      });
    }
  }
});

// ENDPOINT PARA VERIFICAR LIMITE
endpoint.get('/VerificarLimiteLink/:email', async (req, res) => {
    const { email } = req.params;
    
    console.log('📧 Recebida requisição para verificar limite do email:', email);
    
    try {
        const usuario = await LinkRepository.verificarLimiteLink(email);
        if (!usuario) {
            return res.status(404).send({ error: "Usuário não encontrado" });
        }
        
        res.status(200).send({
            maxLink: usuario.maxLink
        });
    } catch (error) {
        console.error('❌ Erro ao verificar limite de link:', error);
        res.status(500).send({ error: "Erro interno do servidor" });
    }
});

// ENDPOINT PARA BUSCAR USUÁRIO POR NOME
endpoint.get('/buscar-usuario/:nome', async (req, res) => {
    const { nome } = req.params;
    
    try {
        const usuario = await LinkRepository.buscarUsuarioPorEmail(nome); // Busca por email ou nome
        if (!usuario) {
            return res.status(404).send({ error: "Usuário não encontrado" });
        }
        
        res.status(200).send({
            id: usuario.id_cadastro,
            nome: usuario.nome,
            email: usuario.email,
            maxLink: usuario.maxLink
        });
    } catch (error) {
        res.status(500).send({ error: "Erro interno do servidor" });
    }
});



export default endpoint;