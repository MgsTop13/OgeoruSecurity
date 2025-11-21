import * as ArquivoRepository from "../repository/ArquivoRepository.js"
import { Router } from "express"
const endpoint = Router();

// Middleware para verificar limite de arquivos
async function verificarLimiteArquivo(req, res, next) {
    const { email, nome } = req.body;
    
    // Se não tem email, tenta buscar por nome
    let usuarioEmail = email;
    
    if (!usuarioEmail && nome) {
        try {
            const usuario = await ArquivoRepository.buscarUsuarioPorEmail(nome);
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
        const usuario = await ArquivoRepository.verificarLimiteArquivo(usuarioEmail);
        
        if (!usuario) {
            return res.status(404).send({ error: "Usuário não encontrado" });
        }

        // Verifica se tem limite disponível
        if (usuario.maxArquivo <= 0) {
            return res.status(402).send({ 
                error: "Limite de verificações atingido",
                tipo: "LIMITE_ATINGIDO",
                mensagem: "Você atingiu o limite de verificações de arquivos gratuitas."
            });
        }

        req.usuario = usuario;
        req.usuarioEmail = usuarioEmail;
        next();
    } catch (error) {
        console.error('Erro ao verificar limite de arquivo:', error);
        res.status(500).send({ error: "Erro interno do servidor" });
    }
}

// ENDPOINT COM LIMITE
endpoint.post('/VerificarArquivoComLimite', verificarLimiteArquivo, async (req, res) => {
    try {
        const { arquivo, email, nome } = req.body;
        if (!arquivo) {
            return res.status(400).send({ error: "Conteúdo do arquivo é obrigatório" });
        }

        // Limpeza do texto
        let textoLimpo = arquivo.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
        textoLimpo = textoLimpo.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        textoLimpo = textoLimpo.replace(/\s+/g, ' ').trim();

        // Verifica tamanho
        if (textoLimpo.length > 500000) {
            return res.status(413).send({ 
                error: "Arquivo muito grande",
                mensagem: "O arquivo excede o limite de 500KB."
            });
        }

        // Decrementar limite
        const decrementado = await ArquivoRepository.decrementarLimiteArquivo(req.usuarioEmail);
        if (!decrementado) {
            return res.status(402).send({ 
                error: "Erro ao atualizar limite",
                tipo: "ERRO_LIMITE"
            });
        }        
        // ADICIONE TRY-CATCH ESPECÍFICO PARA O GEMINI
        let RespostaGemini;
        try {
            RespostaGemini = await ArquivoRepository.enviarMensagem(textoLimpo);
        } catch (geminiError) {
            console.error('❌ Erro específico do Gemini:', geminiError);
            return res.status(503).send({ 
                error: "Serviço de análise temporariamente indisponível",
                detalhes: geminiError.message
            });
        }

        // Obter limite atualizado
        const usuarioAtualizado = await ArquivoRepository.verificarLimiteArquivo(req.usuarioEmail);

        res.send({ 
            Resposta: RespostaGemini,
            limiteRestante: usuarioAtualizado.maxArquivo
        });

    } catch (error) {
        console.error('❌ Erro geral na verificação:', error);
        res.status(500).send({ 
            error: "Erro interno do servidor",
            detalhes: error.message 
        });
    }
});

// ENDPOINT ORIGINAL (sem limite)
endpoint.post('/VerificarArquivo', async (req, res) => {
    try {
        const { arquivo } = req.body;
        if (!arquivo) {
            return res.status(400).send({ error: "Conteúdo do arquivo é obrigatório" });
        }

        // Limpa caracteres de controle
        let textoLimpo = arquivo.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
        textoLimpo = textoLimpo.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        textoLimpo = textoLimpo.replace(/\s+/g, ' ').trim();


        // Verifica se o arquivo é muito grande (opcional)
        if (textoLimpo.length > 500000) {
            return res.status(413).send({ 
                error: "Arquivo muito grande",
                mensagem: "O arquivo excede o limite de 500KB. Por favor, use um arquivo menor."
            });
        }

        const RespostaGemini = await ArquivoRepository.enviarMensagem(textoLimpo);

        res.send({ Resposta: RespostaGemini });

    } catch (error) {
        console.error('❌ Erro na verificação do arquivo:', error);
        res.status(500).send({ error: "Erro interno do servidor" });
    }
});

// ENDPOINT PARA VERIFICAR LIMITE DE ARQUIVOS
endpoint.get('/VerificarLimite/:email', async (req, res) => {
    const { email } = req.params;
    
    
    try {
        const usuario = await ArquivoRepository.verificarLimiteArquivo(email);
        
        console.log('👤 Usuário encontrado:', usuario);
        
        if (!usuario) {
            console.log('❌ Usuário não encontrado para email:', email);
            return res.status(404).send({ error: "Usuário não encontrado" });
        }

        console.log('✅ Limite retornado:', { maxArquivo: usuario.maxArquivo });
        
        res.status(200).send({
            maxArquivo: usuario.maxArquivo
        });
    } catch (error) {
        console.error('❌ Erro ao verificar limite de arquivo:', error);
        res.status(500).send({ error: "Erro interno do servidor" });
    }
});

export default endpoint;