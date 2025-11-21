import BackgroundBlack from "/images/Black/BackgroundBlack.png";
import BackgroundWhite from "/images/White/BackgroundWhite.png";
import Footer from "../../components/footer/index.jsx";
import Cabecalho2 from "../../components/HeaderPages";
import Modal from "../../components/err/index.jsx";
import { useState, useEffect } from "react";
import apiLink from "../../axios.js";
import { Link } from "react-router";
import "./support.scss";

export default function Support() {
  const [opcaoEscolhida, setOpcaoEscolhida] = useState("");
  const [msgUser, setMsgUser] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [codigoErro, setCodigoErro] = useState(null);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [darkTheme, setDarkTheme] = useState(() => {
    const themeSaved = localStorage.getItem("TemaEscuro");
    return themeSaved ? themeSaved === "true" : false;
  });

  function ChangeTheme() {
    setDarkTheme((prevTheme) => !prevTheme);
  }

  useEffect(() => {
    document.body.style.backgroundImage = `url(${
      darkTheme ? BackgroundBlack : BackgroundWhite
    })`;
  }, [darkTheme]);

  useEffect(() => {
    localStorage.setItem("TemaEscuro", darkTheme.toString());
  }, [darkTheme]);

  async function sentMsg() {
    if (opcaoEscolhida === "" && msgUser.trim() === "") {
      alert("Envie pelo menos uma opção ou mensagem!");
      return;
    }

    try {
      const tokenUser = localStorage.getItem("token");
      await apiLink.post("/UserHelp", {
        tokenInserido: tokenUser,
        msg: msgUser,
        opcao: opcaoEscolhida,
      });

      setModalSuccess(true);
      setShowModal(true);
      setOpcaoEscolhida("");
      setMsgUser("");
    } catch (error) {
      if (error.code === 'ERR_NETWORK' || error.message?.includes('CONNECTION_REFUSED')) {
        setCodigoErro('network');
      } else {
        const status = error.response?.status;
        setCodigoErro(status || 'default');
      }
      setModalSuccess(false);
      setShowModal(true);
    }
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Enter") sentMsg();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [opcaoEscolhida, msgUser]);

  return (
    <main className={`MainSupport ${darkTheme ? "dark" : "light"}`}>
      <Cabecalho2 darkTheme={darkTheme} onChangeTheme={ChangeTheme} />
      <section className="support-fundo">
        <div className="container-support">
          <h1 className="titleSupport">Suporte</h1>
          <h2>O que te traz aqui?</h2>

          <div className="div-input">
            <label>Escolha uma opção</label>
            <select
              name="valores"
              value={opcaoEscolhida}
              onChange={(e) => setOpcaoEscolhida(e.target.value)}
            >
              <option value=""></option>
              <option value="Error">Erro</option>
              <option value="Dúvida">Dúvida</option>
              <option value="Sugestão">Sugestão</option>
              <option value="Outro">Outro</option>
            </select>

            <div className="separator">
              <span>Não encontrou nenhum motivo? Escreva sua mensagem:</span>
            </div>

            <textarea
              className="text-area-custom"
              value={msgUser}
              onChange={(e) => setMsgUser(e.target.value)}
              placeholder="Escreva sua mensagem aqui..."
            />
          </div>

          <button onClick={sentMsg} className="butao-verificated">
            Enviar
          </button>

          <Link to={"/UserSupport"} className="link-mensagens">
            Ver minhas mensagens
          </Link>
        </div>
      </section>

      {modalSuccess ? (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className={`modal-content ${darkTheme ? "dark" : "light"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <p>Mensagem enviada com sucesso!</p>
            <button onClick={() => setShowModal(false)}>Fechar</button>
          </div>
        </div>
      ) : (
        <Modal
          isOpen={showModal}
          setModalOpen={() => setShowModal(!showModal)}
          codigoErro={codigoErro}
        />
      )}
      <Footer  darkTheme={darkTheme} onChangeTheme={ChangeTheme}/>
    </main>
  );
}