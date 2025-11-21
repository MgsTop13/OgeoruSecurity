import BackgroundBlack from "/images/Black/BackgroundBlack.png";
import BackgroundWhite from "/images/White/BackgroundWhite.png";
import Cabecalho2 from "../../components/HeaderPages/";
import Footer from "../../components/footer/index.jsx";
import Modal from "../../components/err/index.jsx";
import React, { useState, useEffect } from "react";
import apiLink from "../../axios";
import "./password.scss";

export default function PasswordGenerator() {
  const [darkTheme, setDarkTheme] = useState(() => {
    const themeSaved = localStorage.getItem("TemaEscuro");
    return themeSaved ? themeSaved === "true" : false;
  });

  const ChangeTheme = () => setDarkTheme((prev) => !prev);

  useEffect(() => {
    document.body.style.backgroundImage = `url(${
      darkTheme ? BackgroundBlack : BackgroundWhite
    })`;
  }, [darkTheme]);

  useEffect(() => {
    localStorage.setItem("TemaEscuro", darkTheme.toString());
  }, [darkTheme]);

  const [password1, setPassword1] = useState("");
  const [passwordLength, setPasswordLength] = useState(8);
  const [textUp, setTextUp] = useState(true);
  const [textLower, setTextLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [senha, setSenha] = useState("");
  const [forca, setForca] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [codigoErro, setCodigoErro] = useState(null);
  const [modalConfirm, setModalConfirm] = useState({ open: false, message: "", onConfirm: null });

  const showConfirmModal = (message, onConfirm = null) => {
    setModalConfirm({ open: true, message, onConfirm });
  };

  const closeConfirmModal = (confirmed = false) => {
    if (confirmed && modalConfirm.onConfirm) modalConfirm.onConfirm();
    setModalConfirm({ open: false, message: "", onConfirm: null });
  };

  function GerarSenhas() {
    const len = Number(passwordLength) || 0;

    if (!textLower && !textUp && !numbers && !symbols) {
      alert("Selecione pelo menos uma opção!");
      return;
    }

    if (len < 5 || len > 14) {
      alert("Fora do limite de caracteres!");
      return;
    }

    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    const syms = "!@#$&()_|";

    let all = "";
    if (textLower) all += lower;
    if (textUp) all += upper;
    if (numbers) all += nums;
    if (symbols) all += syms;

    let password = "";
    for (let i = 0; i < len; i++) {
      const idx = Math.floor(Math.random() * all.length);
      password += all[idx];
    }

    setPassword1(password);
  }

  function evaluatePasswordStrength(password1) {
    let score = 0;
    if (!password1) return "";

    if (password1.length > 8) score += 1;
    if (/[a-z]/.test(password1)) score += 1;
    if (/[A-Z]/.test(password1)) score += 1;
    if (/\d/.test(password1)) score += 1;
    if (/[^A-Za-z0-9]/.test(password1)) score += 2;

    switch (score) {
      case 0:
      case 1:
      case 2:
        return "Fraca";
      case 3:
        return "Média";
      case 4:
      case 5:
        return "Forte";
      case 6:
        return "Muito forte";
      default:
        return "";
    }
  }

  async function SalvarSenha() {
    const nome = localStorage.getItem("User");
    const email = localStorage.getItem("Email");

    if (!password1) {
      alert("Não há senha gerada para salvar.");
      return;
    }

    if (!nome || !email) {
      alert("Usuário não logado, por favor faça login.");
      return;
    }

    showConfirmModal(
      `Deseja salvar a senha "${password1}" em sua conta?`,
      async () => {
        try {
          await apiLink.post("/InserirSenhaForte", { senha: password1, email, nome });
          alert("Senha salva com sucesso! Verifique nas configurações da conta.");
        } catch (error) {
          if (error.code === 'ERR_NETWORK' || error.message?.includes('CONNECTION_REFUSED')) {
            setCodigoErro('network');
          } else {
            const status = error.response?.status;
            setCodigoErro(status || 'default');
          }
          setShowModal(true);
        }
      }
    );
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") GerarSenhas();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main className={`mainPassword ${darkTheme ? "dark" : "light"}`}>
      <Cabecalho2 darkTheme={darkTheme} onChangeTheme={ChangeTheme} />
      <section className="conteiner-gerador">
        <div className="gerar">
          <div className="opcoes1">
            <h1 className="title">Gerador de Senhas!</h1>

            <div className="op1">
              <h2>Quantidade de caracteres:</h2>
              <input
                className="tamanho-senha"
                value={passwordLength}
                onChange={(e) => setPasswordLength(e.target.value)}
                type="number"
                min="5"
                max="14"
              />
            </div>

            <div className="checkbox-group">
              <label><input type="checkbox" checked={textUp} onChange={(e) => setTextUp(e.target.checked)} /> Letras maiúsculas</label>
              <label><input type="checkbox" checked={textLower} onChange={(e) => setTextLower(e.target.checked)} /> Letras minúsculas</label>
              <label><input type="checkbox" checked={numbers} onChange={(e) => setNumbers(e.target.checked)} /> Números</label>
              <label><input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} /> Símbolos</label>
            </div>

            <button className="botao-gerar" onClick={GerarSenhas}>Gerar Senha</button>
          </div>

          <div className="senha-gerada">
            <h1 className="titulo-senha">Senha:</h1>
            <h1 className="senha">{password1 || "Nenhuma senha gerada"}</h1>
          </div>
        </div>
      </section>

      <section className="conteiner-forca">
        <div className="seguranca">
          <h2>Segurança:</h2>
          <h2>{forca || "-"}</h2>
        </div>

        <div className="verificar-forca">
          <h2>Verificador de Senhas</h2>
          <input
            type="text"
            placeholder="Insira a senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <div className="botoesSenha">
            <button className="BotaoSalvarSenha" onClick={SalvarSenha}>Salvar Senha</button>
            <button
              className="botao-forca"
              onClick={() => setForca(evaluatePasswordStrength(senha))}
            >
              Verificar senha
            </button>
          </div>
        </div>
      </section>

      {modalConfirm.open && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>{modalConfirm.message}</p>
            <div className="modal-actions">
              <button onClick={() => closeConfirmModal(true)}>Confirmar</button>
              <button onClick={() => closeConfirmModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={showModal}
        setModalOpen={() => setShowModal(!showModal)}
        codigoErro={codigoErro}
      />
      <Footer  darkTheme={darkTheme} onChangeTheme={ChangeTheme}/>
    </main>
  );
}