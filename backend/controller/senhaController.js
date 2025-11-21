import * as SenhaRepository from "../repository/passwordRepository.js";

import { Router } from "express";

const endpoint = Router();

endpoint.post('/RecuperarSenha', async (req, resp) => {
    const { nome, email, palavra, senha } = req.body;

    if (!nome || !email || !palavra || !senha) {
        return resp.status(400).send({
            error: "Dados incompletos",
            message: "Todos os campos (nome, email, palavra, senha) são obrigatórios",
        });
    }

    try {
        const infoUser = await SenhaRepository.InfoConta({ nome, email, palavra });

        if (infoUser.length > 0) {
            const user = infoUser[0];

            if (nome === user.nome && email === user.email && palavra === user.palavra) {
                const id = await SenhaRepository.RecuperarSenha(senha, email, nome);

                resp.status(200).send({
                    message: "Senha alterada com sucesso!"
                });
            }
            else {
                resp.status(401).send({
                    error: "Dados de verificação incorretos",
                    message: "Nome, email ou palavra-chave não correspondem"
                });
            }
        }
        else {
            resp.status(404).send({
                error: "Dados não encontrado",
                message: "Não foi encontrada nenhuma conta ou dados"
            });
        }
    }
    catch (error) {
        resp.status(500).send({
            message: "Não foi possível processar a solicitação",
            error: "Erro interno do servidor",
        });
    }
});

endpoint.post('/InfoUser', async (req, resp) => {
    try {
        const { nome } = req.body;
        
        // Validação do nome
        if (!nome || nome.trim() === "") {
            return resp.status(400).send({ 
                error: "Nome é obrigatório",
                message: "O campo nome não pode estar vazio" 
            });
        }

        const buscarNome = await SenhaRepository.InfoConta2(nome);
        
        // Verifica se o usuário foi encontrado
        if (!buscarNome) {
            return resp.status(404).send({ 
                error: "Usuário não encontrado",
                message: "Nenhum usuário encontrado com o nome fornecido" 
            });
        }

        // Verifica se o nome corresponde
        if (buscarNome.nome === nome) {
            resp.send({ buscarNome });
        } else {
            resp.status(404).send({ 
                error: "Usuário não encontrado",
                message: "Nome não corresponde" 
            });
        }
        
    } catch (error) {
        console.error("Erro no endpoint InfoUser:", error);
        resp.status(500).send({ 
            error: "Erro interno do servidor",
            message: error.message 
        });
    }
});

endpoint.post('/InserirSenhaForte', async (req, resp) => {
    const { senha, email, nome } = req.body;
    try {
        const IdSenha = await SenhaRepository.InserirSenhaForte(senha, email, nome);
        resp.send({NewId: IdSenha});
    } catch(error){
        resp.send(error)
    }
})

export default endpoint;