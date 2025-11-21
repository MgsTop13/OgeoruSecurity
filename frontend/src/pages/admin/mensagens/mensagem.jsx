import BackgroundBlack from "/images/Black/BackgroundBlack.png";
import BackgroundWhite from "/images/White/BackgroundWhite.png";
import CabecalhoAdmin2 from "../../../components/headerAdmin2";
import Footer from "../../../components/footer/index";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import apiLink from "../../../axios";
import "./mensagem.scss";

export default function MsgSupport() {

  //Verificação ADM
  const navigate = useNavigate() 
  const user = localStorage.getItem('User')
  useEffect(() => {
    if (user === "MgsTop13" || user === "Gustavo Max") {
      return
    } else {
      alert('Você não tem acesso!');
      navigate('/')
    }
  }, [user, navigate])

  // Modo escuro
  const [darkTheme, setDarkTheme] = useState(() => {
    const themeSaved = localStorage.getItem("TemaEscuro")
    return themeSaved ? themeSaved === "true" : false
  })

  function ChangeTheme() {
    setDarkTheme(prevTheme => !prevTheme)
  }

  useEffect(() => {
    document.body.style.backgroundImage = `url(${darkTheme ? BackgroundBlack : BackgroundWhite})`
  }, [darkTheme])

  useEffect(() => {
    localStorage.setItem("TemaEscuro", darkTheme.toString())
  }, [darkTheme])

  // Dados
  const [mensagens, setMensagens] = useState([])
  const [mensagemSelecionada, setMensagemSelecionada] = useState(null)
  const [resposta, setResposta] = useState("")
  const [carregando, setCarregando] = useState(true)

  // Buscar mensagens do backend
  useEffect(() => {
    buscarMensagens()
  }, [])

  async function buscarMensagens() {
    try {
      setCarregando(true)
      const response = await apiLink.get('/support')
      setMensagens(response.data)
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error)
      alert("Erro ao carregar mensagens")
    } finally {
      setCarregando(false)
    }
  }

  async function selecionarMensagem(id) {
    try {
      const response = await apiLink.get(`/support/${id}`)
      setMensagemSelecionada(response.data)
      setResposta("")
    } catch (error) {
      console.error("Erro ao buscar mensagem:", error)
      alert("Erro ao carregar mensagem")
    }
  }

  async function enviarResposta() {
    if (!mensagemSelecionada) return
    if (!resposta.trim()) {
      alert("Digite uma resposta")
      return
    }

    try {
      const idAdmin = localStorage.getItem("id_cadastro") || 1 // Você precisa ajustar isso conforme sua autenticação

      await apiLink.post('/support/responder', {
        idSupport: mensagemSelecionada.id,
        idAdmin: idAdmin,
        resposta: resposta
      })

      setResposta("")

      // Atualizar a lista de mensagens
      buscarMensagens()

      // Atualizar a mensagem selecionada
      selecionarMensagem(mensagemSelecionada.id)

    } catch (error) {
      console.error("Erro ao enviar resposta:", error)
      alert("Erro ao enviar resposta")
    }
  }

  function formatarData(data) {
    if (!data) return ''
    return new Date(data).toLocaleString('pt-BR')
  }

  function getStatusColor(status) {
    switch (status) {
      case 'respondido': return '#4CAF50'
      case 'pendente': return '#FF9800'
      default: return '#757575'
    }
  }
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Enter") {
        enviarResposta();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  },);
  return (
    <main className={`MainAdmin ${darkTheme ? "dark" : "light"}`}>
      <CabecalhoAdmin2 darkTheme={darkTheme} onChangeTheme={ChangeTheme} />

      <div className="MensagensMain">
        <div className="card">
          <h1 className="titulo">Mensagens de Suporte</h1>

          <div className="container">
            <div className="col-esquerda">
              {carregando ? (
                <p>Carregando mensagens...</p>
              ) : mensagens.length === 0 ? (
                <p>Nenhuma mensagem encontrada</p>
              ) : (
                mensagens.map((mensagem) => (
                  <div
                    key={mensagem.id}
                    className={`usuario-item ${mensagemSelecionada?.id === mensagem.id ? "ativo" : ""}`}
                    onClick={() => selecionarMensagem(mensagem.id)}
                  >
                    <div className="avatar-usuario">
                      <img
                        src={
                          mensagem.fotoPerfil
                            ? `${apiLink.defaults.baseURL}${mensagem.fotoPerfil}`
                            : "/images/icons/imagemPerfil.png"
                        }
                        alt={mensagem.nome || "Usuário"}
                        className="avatar-img"
                      />
                    </div>

                    <div className="info-usuario">
                      <span className="nome-usuario">{mensagem.nome || 'Usuário'}</span>
                      <span
                        className="status-mensagem"
                        style={{ color: getStatusColor(mensagem.status) }}
                      >
                        {mensagem.status || 'pendente'}
                      </span>
                      <span className="data-mensagem">
                        {formatarData(mensagem.created_at)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="col-direita">
              {mensagemSelecionada ? (
                <>
                  <div className="mensagens-area">
                    <h2>{mensagemSelecionada.nome || 'Usuário'}</h2>

                    <div className="info-contato">
                      <p><strong>ID:</strong> {mensagemSelecionada.idUser}</p>
                      <p><strong>Opção:</strong> {mensagemSelecionada.opcaoSelecionada}</p>
                      <p><strong>Data:</strong> {formatarData(mensagemSelecionada.created_at)}</p>
                      <p><strong>Status:</strong>
                        <span style={{ color: getStatusColor(mensagemSelecionada.status) }}>
                          {mensagemSelecionada.status || 'pendente'}
                        </span>
                      </p>
                    </div>

                    <div className="duvida-usuario">
                      <strong>Mensagem do usuário:</strong>
                      <p>{mensagemSelecionada.msgUser}</p>
                    </div>

                    {mensagemSelecionada.resposta && (
                      <div className="resposta-enviada">
                        <strong>Resposta enviada em {formatarData(mensagemSelecionada.respostaData)}:</strong>
                        <p>{mensagemSelecionada.resposta}</p>
                      </div>
                    )}
                  </div>

                  {(!mensagemSelecionada.resposta || mensagemSelecionada.status !== 'respondido') && (
                    <div className="resposta-area">
                      <textarea
                        placeholder="Escreva sua resposta..."
                        value={resposta}
                        onChange={(e) => setResposta(e.target.value)}
                        rows="4"
                      />
                      <button onClick={enviarResposta}>Enviar resposta</button>
                    </div>
                  )}
                </>
              ) : (
                <div className="nenhuma-selecao">
                  <p>Selecione uma mensagem para visualizar e responder</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer darkTheme={darkTheme} onChangeTheme={ChangeTheme}/>
    </main>
  )
}