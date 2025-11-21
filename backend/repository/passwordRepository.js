import {conexao} from "./conections.js";

export async function InfoConta(dados){
    const command = `
        select nome, email, palavra
            from cadastro
            where nome = ? and email = ? and palavra = ?
    `

    const [info] = await conexao.query(command, [
        dados.nome,
        dados.email,
        dados.palavra
    ])

    return info;
}

export async function InfoConta2(nome){
    const command = `
        select * from cadastro
        where nome = ?;
    `
    const [info] = await conexao.query(command,[nome]);
    return info[0];
}

export async function RecuperarSenha(senha, email, nomeUser){
    const commandSQL = `
        update cadastro 
            set senha = MD5(?) 
                where email = ? and nome = ?;

    `;

    const [info] = await conexao.query(commandSQL, [senha, email, nomeUser]);
    return info;
}

export async function InserirSenhaForte(senha, email, nomeUser) {
    const commandSQL = `
        update cadastro
            set senhaGerada = ?
            where email = ? and nome = ?;
    `

    const [info] = await conexao.query(commandSQL, [senha, email, nomeUser]);
    return info.insertId
}