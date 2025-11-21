import BackgroundBlack from "/images/Black/BackgroundBlack.png";
import BackgroundWhite from "/images/White/BackgroundWhite.png";
import Footer  from "../../components/footer/index.jsx";
import Cabecalho2 from "../../components/HeaderPages";
import Modal from "../../components/err/index.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import apiLink from "../../axios.js";
import "./recuperador.scss";

export default function RecuperadorDeSenhas() {
  const [darkTheme, setDarkTheme] = useState(() => {
    const themeSaved = localStorage.getItem("TemaEscuro");
    return themeSaved ? themeSaved === "true" : false;
  });

  function ChangeTheme() {
    setDarkTheme((prevTheme) => !prevTheme);
  }

  useEffect(() => {
    document.body.style.backgroundImage = `url(${darkTheme ? BackgroundBlack : BackgroundWhite})`;
  }, [darkTheme]);

  const [mostrar, setMostrar] = useState(false);
  const [palavra, setPalavra] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [codigoErro, setCodigoErro] = useState(null);
  const [modalSuccess, setModalSuccess] = useState(false);
  const navigate = useNavigate();

  async function RecuperarSenha() {
    if (!name || !email || !palavra || !senha) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    try {
      const response = await apiLink.post("/RecuperarSenha", {
        nome: name,
        email: email,
        palavra: palavra,
        senha: senha,
      });
      
      setModalSuccess(true);
      setShowModal(true);
      
      setTimeout(() => {
        setShowModal(false);
        navigate("/Login");
      }, 2000);
      
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
      if (event.key === "Enter") {
        RecuperarSenha();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [name, email, palavra, senha]);

  return (
    <main className={`MainRecuperador ${darkTheme ? "dark" : "light"}`}>
      <Cabecalho2 darkTheme={darkTheme} onChangeTheme={ChangeTheme} />
      <section className="ContainerRecuperador">
        <div className="fundo-secundario">
          <div className="Recuperador-fundo">
            <h1>Recupere sua senha</h1>
            <h2>Esqueceu sua senha? Recupere com facilidade!</h2>
          </div>
          <div className="conteiner-recuperador">
            <input
              className="um"
              type="text"
              placeholder="Nome/Apelido"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="um"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="um"
              type="text"
              placeholder="Senha Aleatória"
              value={palavra}
              onChange={(e) => setPalavra(e.target.value)}
            />
            <div className="campo-senha">
              <input
                className="input-senha"
                type={mostrar ? "text" : "password"}
                placeholder="Nova Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <button
                className="botao-visivel"
                onClick={() => setMostrar(!mostrar)}
              ></button>
              <button className="botao" onClick={RecuperarSenha}>
                Recuperar
              </button>
            </div>
          </div>
        </div>
      </section>

      {modalSuccess ? (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className={`modal-content ${darkTheme ? "dark" : "light"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <p>Senha recuperada com sucesso! Redirecionando para login...</p>
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