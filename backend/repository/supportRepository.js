// repository/SupportRepository.js
import { conexao } from "./conections.js";

export async function MensagemUser(idUser, msg, opcao) {
    const mensagemUser = ` 
        INSERT INTO tb_support(idUser, msgUser, opcaoSelecionada)
        VALUES(?, ?, ?)
    `;
    
    const [info] = await conexao.query(mensagemUser, [idUser, msg, opcao]);
    return info.insertId;
}

export async function listarMensagens() {
    const [rows] = await conexao.query(`
      SELECT 
        s.id,
        s.idUser,
        c.nome,
        s.msgUser,
        s.opcaoSelecionada,
        s.status,
        s.created_at,
        c.fotoPerfil
      FROM tb_support s
      JOIN cadastro c ON s.idUser = c.id_cadastro
      ORDER BY s.created_at DESC
    `);
  
    return rows;
}

// Funções adicionais para respostas do suporte
export async function responderMensagemSupport(idSupport, idAdmin, resposta) {
    const command = `
        INSERT INTO tb_support_resposta (idSupport, idAdmin, resposta)
        VALUES(?, ?, ?)
    `;
    
    const [info] = await conexao.query(command, [idSupport, idAdmin, resposta]);
    return info.insertId;
}

export async function atualizarStatusMensagem(id, status) {
    const command = `
        UPDATE tb_support 
        SET status = ? 
        WHERE id = ?
    `;
    
    const [result] = await conexao.query(command, [status, id]);
    return result.affectedRows > 0;
}