import imgE from "/images/icons/icone_erro.png";
import mascote404 from "/images/icons/mascoteG404.png";
import mascote401 from "/images/icons/mascote401.png";
import mascote403 from "/images/icons/mascote403.png";
import cabo from "/images/icons/cabos.png";
import mascoteg from "/images/icons/Mgs-d.png";
import "./erro.scss";

const errosConfig = {
  404: {
    boxShadow: "#020285",
    text: (
      <>
        <span className="dd">Erro 404</span>: Página não encontrada!
        <br />Tente novamente ou volte para a página inicial.
      </>
    ),
    mascote: mascote404,
    cabo: cabo
  },
  401: {
    boxShadow: "#f35b04",
    text: (
      <>
        <span className="dd">Erro 401</span>: Você não tem autorização!
        <br />Faça login para continuar.
      </>
    ),
    mascote: mascote401,
    cabo: cabo
  },
  403: {
    boxShadow: "#43aa8b",
    text: (
      <>
        <span className="dd">Erro 403</span>: Acesso proibido!
        <br />Você não pode acessar esta página.
      </>
    ),
    mascote: mascote403,
    cabo: cabo
  },
  500: {
    boxShadow: "#ff6b6b",
    text: (
      <>
        <span className="dd">Erro 500</span>: Erro interno do servidor!
        <br />Tente novamente mais tarde.
      </>
    ),
    mascote: mascoteg,
    cabo: cabo
  },
  network: {
    boxShadow: "#ff001e",
    text: (
      <>
        <span className="dd">Erro de Conexão</span>: Servidor offline!
        <br />Verifique sua conexão e tente novamente.
      </>
    ),
    mascote: mascoteg,
    cabo: cabo
  },
  default: {
    boxShadow: "#ff001e",
    text: (
      <>
        <span className="dd">Erro inesperado</span>
        <br />Algo deu errado. Tente novamente mais tarde.
      </>
    ),
    mascote: mascoteg,
    cabo: cabo
  }
};

export default function Err({ isOpen, setModalOpen, codigoErro }) {
  if (!isOpen) return null;

  // Usa o código de erro ou 'default' se não encontrado
  const erro = errosConfig[codigoErro] || errosConfig.default;

  function fechamento(e) {
    if (e.target.classList.contains("MainErr")) {
      setModalOpen();
    }
  }

  return (
    <main
      className="MainErr"
      onClick={fechamento}
    >
      <section className="fundo-err">
        <div className="conteiner-err">
          <div className="err-imgs">
            <img className="error-img" src={imgE} height="70px" />
            <img className="masacote" src={erro.mascote} height="70px" />
          </div>

          <div className="err-text">
            <p className="pp">{erro.text}</p>
            <img src={erro.cabo} height="50px" />
          </div>
        </div>
      </section>
    </main>
  );
}