// repository/UserRepository.js
import { conexao } from "./conections.js";

export async function atualizarStatusPagamento(email) {
  const command = `
      UPDATE cadastro 
      SET pago = 1, maxArquivo = 10, maxLink = 10 
      WHERE email = ?
  `;
  
  const [result] = await conexao.query(command, [email]);
  return result;
}

export async function buscarUsuarioPorEmail(email) {
  const command = `
      SELECT id_cadastro, nome, email, pago, maxArquivo, maxLink 
      FROM cadastro 
      WHERE email = ?
  `;
  
  const [rows] = await conexao.query(command, [email]);
  return rows[0];
}