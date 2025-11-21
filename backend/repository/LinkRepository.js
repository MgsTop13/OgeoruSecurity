// repository/LinkRepository.js
import { conexao } from "./conections.js";

export async function verificarLimiteLink(email) {
  const command = `
      SELECT maxLink 
      FROM cadastro 
      WHERE email = ?
  `;
  
  const [rows] = await conexao.query(command, [email]);
  return rows[0];
}

export async function decrementarLimiteLink(email) {
  const command = `
      UPDATE cadastro 
      SET maxLink = maxLink - 1 
      WHERE email = ? AND maxLink > 0
  `;
  
  const [result] = await conexao.query(command, [email]);
  return result.affectedRows > 0;
}

export async function buscarUsuarioPorEmail(email) {
  const command = `
      SELECT id_cadastro, nome, email, maxLink 
      FROM cadastro 
      WHERE email = ?
  `;
  
  const [rows] = await conexao.query(command, [email]);
  return rows[0];
}