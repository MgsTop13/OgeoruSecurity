import {conexao} from "./conections.js";

export async function salvarUsuario({ nome, email, senha, palavra, idade }) {
  const comando = `
    insert into cadastro (nome, email, senha, palavra, idade)
    values (?, ?, MD5(?), ?, ?)
  `;
  const [res] = await conexao.execute(comando, [nome, email, senha, palavra, idade]);
  return res.insertId;
}

export async function UserIgual(nome){
  const comando = `
    select nome from cadastro
      where nome = ?;
  `

  const [info] = await conexao.query(comando,[nome]);
  return info[0];
}

export async function salvarLogin({ id_cadastro, nome, email, senha }) {
  const comando = `
    insert into tb_login (id_cadastro, nome, email, senha)
    values (?, ?, ?, MD5(?))
  `;
  const [res] = await conexao.execute(comando, [id_cadastro, nome, email, senha]);
  return res.insertId;
}

export async function atualizarFotoPerfil(nome, caminho) {
  const comando = `
    UPDATE cadastro
    SET fotoPerfil = ?
    WHERE nome = ?
  `;
  const [res] = await conexao.execute(comando, [caminho, nome]);
  return res.affectedRows;
}