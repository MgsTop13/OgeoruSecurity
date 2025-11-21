import { conexao } from "./conections.js";

export async function listarMensagens() {
  const comandoSQL = `
    SELECT 
      tb_support.id, 
      tb_support.idUser, 
      cadastro.nome, 
      tb_support.msgUser, 
      tb_support.opcaoSelecionada, 
      tb_support.status, 
      tb_support.created_at
    FROM tb_support
    JOIN cadastro ON tb_support.idUser = cadastro.id_cadastro
    ORDER BY tb_support.created_at DESC
  `;
  const [registros] = await conexao.query(comandoSQL);
  return registros;
}

export async function buscarMensagem(idSupport) {
  const comandoSQL = `
    SELECT 
      tb_support.*, 
      tb_support_resposta.resposta, 
      tb_support_resposta.created_at AS respostaData
    FROM tb_support
    LEFT JOIN tb_support_resposta ON tb_support.id = tb_support_resposta.idSupport
    WHERE tb_support.id = ?
  `;
  const [registros] = await conexao.query(comandoSQL, [idSupport]);
  return registros[0];
}

export async function salvarResposta(idSupport, idAdmin, resposta) {
  const comandoInsert = `
    INSERT INTO tb_support_resposta (idSupport, idAdmin, resposta)
    VALUES (?, ?, ?)
  `;
  await conexao.query(comandoInsert, [idSupport, idAdmin, resposta]);

  const comandoUpdate = `
    UPDATE tb_support 
    SET status = 'respondido' 
    WHERE id = ?
  `;
  await conexao.query(comandoUpdate, [idSupport]);
}

export async function buscarMensagensPorUsuario(idUsuario) {
  const comandoSQL = `
    SELECT 
      tb_support.id,
      tb_support.msgUser,
      tb_support.opcaoSelecionada,
      tb_support.status,
      tb_support.created_at,
      tb_support_resposta.resposta,
      tb_support_resposta.created_at AS respostaData,
      cadastro.nome AS adminNome
    FROM tb_support
    LEFT JOIN tb_support_resposta ON tb_support.id = tb_support_resposta.idSupport
    LEFT JOIN cadastro ON tb_support_resposta.idAdmin = cadastro.id_cadastro
    WHERE tb_support.idUser = ?
    ORDER BY tb_support.created_at DESC
  `;
  const [registros] = await conexao.query(comandoSQL, [idUsuario]);
  return registros;
}