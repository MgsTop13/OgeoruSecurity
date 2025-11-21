import * as UpdateRepository from "../repository/UpdatesRepository.js"
import {Router} from "express";
const endpoint = Router();

endpoint.post('/InserirUpdate', async (req, res) => {
    const { date, titulo, desc } = req.body;

    
    try {
        const result = await UpdateRepository.InserirUpdate(date, titulo, desc);
        res.status(201).send({ 
            message: "Update inserido com sucesso",
            id: result.insertId 
        });
    } catch(error) {
        console.error('Erro ao inserir update:', error);
        res.status(500).send({ error: "Erro interno do servidor" });
    }
});

endpoint.delete('/RemoverUpdate/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        await UpdateRepository.RemoverUpdate(id);
        res.status(200).send({ message: "Update removido com sucesso" });
    } catch(error) {
        console.error('Erro ao remover update:', error);
        res.status(500).send({ error: "Erro interno do servidor" });
    }
});

endpoint.get('/ListarUpdates', async (req, res) => {
    try {
        const updates = await UpdateRepository.ListarUpdates();
        res.status(200).send({ updates });
    } catch(error) {
        console.error('Erro ao listar updates:', error);
        res.status(500).send({ error: "Erro interno do servidor" });
    }
});

export default endpoint;