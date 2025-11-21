drop database Tcc;
create database Tcc;
use ;

create table cadastro(
    id_cadastro int primary key auto_increment,
    nome varchar(100) not null,
    email varchar(100) not null,
    senha varchar(100) not null,
    palavra varchar(100) not null,
    maxArquivo int default (5),
    maxLink int default (5),
    pago boolean default (0),
    senhaGerada varchar(100),
    idade date not null,
	fotoPerfil VARCHAR(255)
);

create table tb_login(
    id_login int primary key auto_increment,
    id_cadastro int,
    nome varchar(100)not null,
    email varchar(100) not null,
    senha varchar(100) not null,
    foreign key(id_cadastro) references cadastro(id_cadastro)
);


create table tb_support (
    id int auto_increment primary key,
    idUser int,
    msgUser varchar(255),
    opcaoSelecionada varchar(255),
    status varchar(50) default 'pendente',
    created_at timestamp default current_timestamp,
    foreign key (idUser) references cadastro(id_cadastro)
);


create table tb_support_resposta (
    id int primary key auto_increment,
    idSupport int not null,
    idAdmin int not null,
    resposta text not null,
    created_at timestamp default current_timestamp,
    foreign key (idSupport) references tb_support(id),
    foreign key (idAdmin) references cadastro(id_cadastro)
);

create table Updates (
    id int primary key auto_increment,
    DiadoUpdate date not null,
    titulo varchar(255) not null,
    descricao varchar(255) not null
);

create table InfosVirus (
    id int primary key auto_increment,
    nome_virus varchar(255),
    descricao_virus varchar(255),
    prevensao varchar(255)
);

select * from cadastro;
select * from Updates;



drop table tb_support_resposta;
drop table tb_support;
drop table tb_login;
drop table cadastro;
drop table Updates;