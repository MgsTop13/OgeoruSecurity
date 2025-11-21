import * as Repository from "../repository/cadastroRepository.js";
import { Router } from "express";

import multer from "multer";

import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

const endpoint = Router();

endpoint.post("/registro", async (req, res) => {
  const { nome, email, senha, palavra, confirmarSenha, idade } = req.body;

  if (!nome || !email || !senha || !confirmarSenha || !palavra || !idade)
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });

  if (senha !== confirmarSenha)
    return res.status(400).json({ error: "As senhas não conferem" });

  if (senha.length < 8)
    return res.status(400).json({ error: "A senha deve ter pelo menos 8 caracteres." });

  try {
    const usuarioExiste = await Repository.UserIgual(nome);

    if (usuarioExiste && usuarioExiste.nome === nome) {
      return res.status(400).send("Usuário já existe!");
    }

    const id = await Repository.salvarUsuario({ nome, email, senha, palavra, idade });
    await Repository.salvarLogin({ id_cadastro: id, nome, email, senha });

    res.status(201).json({
      message: "Usuário registrado com sucesso!",
      id
    });

  } catch (error) {
    console.error("Erro ao registrar:", error);
    res.status(500).send("Erro interno ao registrar usuário!");
  }
});

endpoint.post("/uploadFoto", upload.single("foto"), async (req, res) => {
  try {
    const nome = req.body.nome;
    if (!req.file) {
      return res.status(400).json({ error: "Nenhuma imagem foi enviada." });
    }

    const caminho = `/uploads/${req.file.filename}`;
    await Repository.atualizarFotoPerfil(nome, caminho);

    res.status(200).json({ success: true, caminho });
  } catch (error) {
    console.error("Erro ao salvar foto de perfil:", error);
    res.status(500).json({ error: "Erro ao salvar a foto de perfil." });
  }
});

export default endpoint;