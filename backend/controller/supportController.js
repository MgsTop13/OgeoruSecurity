import * as Support from "../repository/supportRepository.js"; 
import { getAuthentication, verifyToken } from "../utils/jwt.js"; 
import Router from "express"; 
const endpoints = Router(); 

endpoints.post("/UserHelp", async (req, resp) => { 
    const {tokenInserido, msg, opcao} = req.body;
    const dadosToken = verifyToken(tokenInserido)
    
    try {
        const idUser = dadosToken.id;
        const resposta = await Support.MensagemUser(idUser, msg, opcao); 
        resp.send({ mensagemId: resposta }); 
    } catch (error) { 
        resp.status(500).send({ error: error }); 
    } }); 

    endpoints.get("/support", async (req, res) => {
        try {
          const mensagens = await Support.listarMensagens();
          res.status(200).json(mensagens);
        } catch (err) {
          console.error("Erro ao listar mensagens:", err);
          res.status(500).json({ error: "Erro ao buscar mensagens" });
        }
      });
    

export default endpoints;