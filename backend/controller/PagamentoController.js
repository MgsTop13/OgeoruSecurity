import {atualizarStatusPagamento} from "../repository/UserRepository.js"
import { Router } from "express"
const endpoint = Router();

endpoint.put('/InserirPagamento', async (req,res) => {
    const {email} = req.body;
    try{
        const table = await atualizarStatusPagamento(email);
        res.send({Sla: table})
    } catch(error){
        res.send(error)
    }
})

export default endpoint;