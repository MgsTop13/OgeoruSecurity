import * as AdemirRepository from "../repository/AdemirRepository.js";
import Router from "express";

const endpoints = Router();

endpoints.get("/support", async (request, response) => {
  try {
    const dados = await AdemirRepository.listarMensagens();
    response.json(dados);
  } catch (erro) {
    response.status(500).json({ erro: erro.message });
  }
});

endpoints.get("/support/:id", async (request, response) => {
  try {
    const idSupport = request.params.id;
    const dados = await AdemirRepository.buscarMensagem(idSupport);
    
    if (!dados) {
      return response.status(404).json({ mensagem: "Mensagem de suporte não encontrada" });
    }
    
    response.json(dados);
  } catch (erro) {
    response.status(500).json({ erro: erro.message });
  }
});

endpoints.post("/support/responder", async (request, response) => {
  try {
    const { idSupport, idAdmin, resposta } = request.body;
    
    if (!idSupport || !idAdmin || !resposta) {
      return response.status(400).json({ mensagem: "Campos incompletos. São necessários: idSupport, idAdmin e resposta" });
    }

    await AdemirRepository.salvarResposta(idSupport, idAdmin, resposta);
    response.json({ mensagem: "Resposta enviada com sucesso" });
  } catch (erro) {
    response.status(500).json({ erro: erro.message });
  }
});

endpoints.get("/support/usuario/:idUsuario", async (request, response) => {
  try {
    const idUsuario = request.params.idUsuario;
    
    if (!idUsuario) {
      return response.status(400).json({ mensagem: "ID do usuário é obrigatório" });
    }

    const mensagens = await AdemirRepository.buscarMensagensPorUsuario(idUsuario);
    response.json(mensagens);
  } catch (erro) {
    response.status(500).json({ erro: erro.message });
  }
});

export default endpoints;