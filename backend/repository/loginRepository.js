import { conexao } from './conections.js';
import MD5 from 'md5';

export async function consultarCredenciais(nome, email, senha) {
  const senhaMD5 = MD5(senha);
  const comandoSQL = `
    SELECT 
      tb_login.id_login,
      tb_login.nome,
      tb_login.email,
      cadastro.id_cadastro
    FROM tb_login
    INNER JOIN cadastro ON tb_login.id_cadastro = cadastro.id_cadastro
    WHERE tb_login.nome = ?
      AND tb_login.email = ?
      AND tb_login.senha = ?
  `;

  const [registros] = await conexao.query(comandoSQL, [nome, email, senhaMD5]);
  if (registros.length > 0) {
    return registros[0];
  } else {
    return null;
  }
}

export async function buscarUsuarioPorId(id) {
  const comandoSQL = `
    SELECT 
      tb_login.id_login,
      tb_login.nome,
      tb_login.email,
      tb_login.senha,
      cadastro.id_cadastro
    FROM tb_login
    INNER JOIN cadastro ON tb_login.id_cadastro = cadastro.id_cadastro
    WHERE tb_login.id_login = ?
  `;
  
  const [registros] = await conexao.query(comandoSQL, [id]);
  return registros;
}