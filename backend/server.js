import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AddRotas } from './router.js';

import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// servir a pasta de uploads
app.use("/storage", express.static(path.join(process.cwd(), "public/storage")));

// Carrega variáveis de ambiente PRIMEIRO
dotenv.config();

const PORT = process.env.PORT || 5010;

// Middlewares
app.use(cors());
app.use(cors({
  origin: [
    "https://ogeorussecurity.onrender.com",
    "http://localhost:5173",
    "http://localhost:3000"
  ],
  credentials: true
}));
app.use(express.json());

// Debug: Verificar se a API Key foi carregada
console.log('API Links Google Funcionando?', process.env.GOOGLE_SAFE_BROWSING_API_KEY ? 'Sim' : 'Não');
console.log('API Gemini Funcionando?', process.env.GEMINI_API_KEY ? 'Sim' : 'Não');

// Configura todas as rotas
AddRotas(app);



// Middleware de erro global
app.use((error, req, res, next) => {
  console.error('Erro global:', error);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: error.message 
  });
});

app.get("/", (req, res) => {
  res.send("API rodando ✔️");
});


//Iniciando o server
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});