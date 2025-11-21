import BackgroundBlack from "/images/Black/BackgroundBlack.png";
import BackgroundWhite from "/images/White/BackgroundWhite.png";
import Footer from '../../components/footer'
import Cabecalho2 from "../../components/HeaderPages";
import Modal from "../../components/err/index.jsx";
import { useEffect, useState } from "react";
import apiLink from "../../axios.js";
import "../../scss/global.scss";
import "../../scss/fonts.scss";
import "./verify.scss";

export default function Verify() {
  const [darkTheme, setDarkTheme] = useState(() => {
    const themeSaved = localStorage.getItem("TemaEscuro");
    return themeSaved ? themeSaved === "true" : false;
  });

  const [limite, setLimite] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mostrarModalPagamento, setMostrarModalPagamento] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [codigoErro, setCodigoErro] = useState(null);

  function ChangeTheme() {
    setDarkTheme((prevTheme) => !prevTheme);
  }

  useEffect(() => {
    document.body.style.backgroundImage = `url(${darkTheme ? BackgroundBlack : BackgroundWhite})`;
  }, [darkTheme]);

  useEffect(() => {
    localStorage.setItem("TemaEscuro", darkTheme.toString());
  }, [darkTheme]);

  const user = localStorage.getItem("User");
  const isAdmin = user === "MgsTop13" || user === "Gustavo2";

  useEffect(() => {
    carregarLimite();
  }, []);

  async function carregarLimite() {
    const email = localStorage.getItem("Email");
    const user = localStorage.getItem("User");

    if (!email || !user) return;

    if (isAdmin) {
      setLimite({ maxArquivo: 9999 });
      return;
    }

    try {
      const response = await apiLink.get(`/VerificarLimite/${email}`);
      setLimite(response.data);
    } catch (error) {
      if (error.code === 'ERR_NETWORK' || error.message?.includes('CONNECTION_REFUSED')) {
        setCodigoErro('network');
      } else {
        const status = error.response?.status;
        setCodigoErro(status || 'default');
      }
      setShowModal(true);
      setLimite({ maxArquivo: 0 });
    }
  }

  async function processarPagamento() {
    const email = localStorage.getItem("Email");

    try {
      setLoading(true);
      await apiLink.post("/ProcessarPagamento", { email });

      alert("Pagamento processado com sucesso!");
      setMostrarModalPagamento(false);
      setLimite({ maxArquivo: 999 });
    } catch (error) {
      if (error.code === 'ERR_NETWORK' || error.message?.includes('CONNECTION_REFUSED')) {
        setCodigoErro('network');
      } else {
        const status = error.response?.status;
        setCodigoErro(status || 'default');
      }
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  }

  async function VerificarLogin() {
    const user = localStorage.getItem("User");
    const email = localStorage.getItem("Email");

    if (!user || !email) {
      alert("Faça login para continuar");
      return;
    }

    if (!isAdmin && limite && limite.maxArquivo <= 0) {
      setMostrarModalPagamento(true);
      return;
    }

    const extensoesSuportadas = ["bat", "sh", "ps1", "vbs", "cmd", "txt"];
    const arquivo = document.getElementById("arquivo").files[0];
    const resultado = document.getElementById("resultado");

    if (!arquivo) {
      alert("Nenhum arquivo selecionado.");
      return;
    }

    if (arquivo.size > 500 * 1024) {
      resultado.textContent = "Arquivo muito grande. Limite: 500KB";
      resultado.classList.add("mostrar");
      return;
    }

    const extensao = arquivo.name.split(".").pop().toLowerCase();
    if (!extensoesSuportadas.includes(extensao)) {
      resultado.textContent = `Tipo de arquivo não suportado: .${extensao} (suportados: ${extensoesSuportadas.join(
        ", "
      )})`;
      resultado.classList.add("mostrar");
      return;
    }

    resultado.textContent = "Aguarde, verificando arquivo...";
    resultado.classList.add("mostrar");
    setLoading(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const textoOriginal = e.target.result;
      let texto = textoOriginal
        .replace(/[\x00-\x1F\x7F-\x9F]/g, "")
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .replace(/\s+/g, " ")
        .trim();

      try {
        let resposta;
        if (isAdmin) {
          resposta = await apiLink.post("/VerificarArquivo", { arquivo: texto });
        } else {
          resposta = await apiLink.post("/VerificarArquivoComLimite", {
            arquivo: texto,
            email: email,
            nome: user,
          });
          setLimite({ maxArquivo: resposta.data.limiteRestante });
        }

        const resp = String(resposta.data.Resposta || resposta.data)
          .trim()
          .toLowerCase();

        if (resp === "inofensivo") {
          resultado.textContent = "Nenhuma ameaça detectada.";
        } else if (resp.startsWith("perigoso")) {
          resultado.textContent = resposta.data.Resposta || resposta.data;
        } else {
          resultado.textContent = `Resultado: ${resposta.data.Resposta || resposta.data}`;
        }
      } catch (error) {
        if (error.response?.status === 402) {
          if (error.response.data.tipo === "LIMITE_ATINGIDO") {
            setMostrarModalPagamento(true);
            resultado.textContent = "Limite de verificações atingido.";
          } else {
            resultado.textContent = "Erro ao processar verificação.";
          }
        } else {
          if (error.code === 'ERR_NETWORK' || error.message?.includes('CONNECTION_REFUSED')) {
            setCodigoErro('network');
          } else {
            const status = error.response?.status;
            setCodigoErro(status || 'default');
          }
          setShowModal(true);
          resultado.textContent = "Erro ao verificar arquivo. Tente novamente.";
        }
      } finally {
        resultado.classList.add("mostrar");
        setLoading(false);
      }
    };

    reader.readAsText(arquivo);
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Enter") {
        VerificarLogin();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main
      className={`MainVerifyArchiver ${darkTheme ? "dark" : "light"} ${
        !isAdmin && limite?.maxArquivo === 0 ? "limite-zero" : ""
      }`}
    >
      <Cabecalho2 darkTheme={darkTheme} onChangeTheme={ChangeTheme} />

      {!isAdmin && mostrarModalPagamento && (
        <div className="modal-overlay">
          <div className="modal-pagamento">
            <h3>Limite Atingido!</h3>
            <p>Você usou todas as suas verificações gratuitas.</p>
            <p>Faça o pagamento para continuar usando o verificador!</p>

            <div className="modal-botoes">
              <button
                onClick={processarPagamento}
                disabled={loading}
                className="btn-pagar"
              >
                {loading ? "Processando..." : "Pagar Agora - R$ 2,99"}
              </button>
              <button
                onClick={() => setMostrarModalPagamento(false)}
                className="btn-cancelar"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="page-archiver">
        <div className="card-archiver">
          {limite && (
            <div
              className={`info-limite ${
                !isAdmin && limite.maxArquivo === 0 ? "zero" : ""
              }`}
            >
              <h4>
                {isAdmin
                  ? "ADMIN - Verificações Ilimitadas"
                  : limite.maxArquivo === 0
                  ? "Limite Esgotado!"
                  : `Verificações Restantes: ${limite.maxArquivo}/5`}
              </h4>

              {!isAdmin &&
                limite.maxArquivo <= 2 &&
                limite.maxArquivo > 0 && (
                  <p className="aviso-limite">
                    Você está ficando sem verificações gratuitas!
                  </p>
                )}

              {!isAdmin && limite.maxArquivo === 0 && (
                <p
                  style={{
                    margin: "10px 0 0 0",
                    fontSize: "0.9rem",
                    opacity: "0.9",
                  }}
                >
                  Faça upgrade para verificar mais arquivos!
                </p>
              )}
            </div>
          )}

          <div className="part1-archiver">
            <h2>Verificador de Arquivos</h2>
            <input
              type="file"
              id="arquivo"
              accept=".bat,.sh,.ps1,.vbs,.cmd,.txt"
              disabled={!isAdmin && limite?.maxArquivo === 0}
            />
          </div>

          <div className="part2-archiver">
            <h3>Resultado:</h3>
            <pre
              className="resultado"
              id="resultado"
              style={{
                minHeight: "100px",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {!isAdmin && limite?.maxArquivo === 0
                ? "Faça upgrade para verificar arquivos"
                : "Aguardando verificação..."}
            </pre>
          </div>

          <button
            className="button-verifyArchiver"
            onClick={VerificarLogin}
            disabled={loading || (!isAdmin && limite?.maxArquivo === 0)}
          >
            {loading
              ? "Verificando..."
              : !isAdmin && limite?.maxArquivo === 0
              ? "Upgrade Necessário"
              : "Verificar Arquivo"}
          </button>
        </div>
      </section>
      <Footer darkTheme={darkTheme} className='a' />

      <Modal
        isOpen={showModal}
        setModalOpen={() => setShowModal(!showModal)}
        codigoErro={codigoErro}
      />
    </main>
  );
}