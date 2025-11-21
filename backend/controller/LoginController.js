import { consultarCredenciais, buscarUsuarioPorId } from '../repository/loginRepository.js'
import { Router } from "express";
import generateToken from '../utils/jwt.js';
import { verifyToken } from '../utils/jwt.js'

const endpoints = Router();

endpoints.post('/Login', async (request, response) => {
  const { nome, email, senha } = request.body;

  const dadosUsuario = await consultarCredenciais(nome, email, senha);

  if (!dadosUsuario) {
    response.status(401).send("Credenciais não encontradas");
  } else {
    const token = generateToken({ 
      id: dadosUsuario.id_login, 
      id_cadastro: dadosUsuario.id_cadastro, // ADICIONE ISSO
      role: 'user' 
    });
    
    // RETORNE TODOS OS DADOS IMPORTANTES
    response.json({ 
      token: token,
      id_cadastro: dadosUsuario.id_cadastro,
      nome: dadosUsuario.nome,
      email: dadosUsuario.email
    });
  }
})

endpoints.post('/LoginADM', async (request, response) => {
  const token = request.body.tokenInserido;
  const tokenData = verifyToken(token);
  
  if (!tokenData) {
    return response.status(401).send("Token inválido");
  }

  const usuario = await buscarUsuarioPorId(tokenData.id);
  
  if (!usuario || usuario.length === 0) {
    return response.status(404).send("Usuário não encontrado");
  }

  response.send({ Usuario: usuario });
})

export default endpoints;