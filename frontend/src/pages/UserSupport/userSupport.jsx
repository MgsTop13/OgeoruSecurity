import BackgroundBlack from "/images/Black/BackgroundBlack.png";
import BackgroundWhite from "/images/White/BackgroundWhite.png";
import Footer from "../../components/footer/index.jsx";
import Cabecalho2 from "../../components/HeaderPages";
import Modal from "../../components/err/index.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import apiLink from "../../axios";
import "./userSupport.scss";

export default function UserSupport() {
  const navigate = useNavigate();

  const [darkTheme, setDarkTheme] = useState(() => {
    const themeSaved = localStorage.getItem("TemaEscuro");
    return themeSaved ? themeSaved === "true" : false;
  });

  function ChangeTheme() {
    setDarkTheme(prevTheme => !prevTheme);
  }

  useEffect(() => {
    document.body.style.backgroundImage = `url(${darkTheme ? BackgroundBlack : BackgroundWhite})`;
  }, [darkTheme]);

  useEffect(() => {
    localStorage.setItem("TemaEscuro", darkTheme.toString());
  }, [darkTheme]);

  const [mensagens, setMensagens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagemSelecionada, setMensagemSelecionada] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [codigoErro, setCodigoErro] = useState(null);

  useEffect(() => {
    buscarMinhasMensagens();
  }, []);

  async function buscarMinhasMensagens() {
    try {
      setCarregando(true);

      const idUsuario = localStorage.getItem("id_cadastro");
      if (!idUsuario) {
        alert("Usuário não identificado. Faça login novamente.");
        return;
      }

      const response = await apiLink.get(`/support/usuario/${idUsuario}`);
      setMensagens(response.data || []);

    } catch (error) {
      if (error.code === 'ERR_NETWORK' || error.message?.includes('CONNECTION_REFUSED')) {
        setCodigoErro('network');
      } else {
        const status = error.response?.status;
        setCodigoErro(status || 'default');
      }
      setShowModal(true);
      setMensagens([]);
    } finally {
      setCarregando(false);
    }
  }

  function formatarData(data) {
    if (!data) return '';
    return new Date(data).toLocaleString('pt-BR');
  }

  function getStatusColor(status) {
    switch (status) {
      case 'respondido': return '#4CAF50';
      case 'pendente': return '#FF9800';
      default: return '#757575';
    }
  }

  function getStatusTexto(status) {
    switch (status) {
      case 'respondido': return 'Respondido';
      case 'pendente': return 'Pendente';
      default: return status;
    }
  }

  return (
    <main className={`MainUserSupport ${darkTheme ? "dark" : "light"}`}>
      <Cabecalho2 darkTheme={darkTheme} onChangeTheme={ChangeTheme} />

      <div className="UserSupportContainer">
        <div className="header-section">
          <h1>Minhas Mensagens de Suporte</h1>
          <p>Acompanhe suas solicitações e respostas da administração</p>
        </div>

        <div className="mensagens-grid">
          {carregando ? (
            <div className="carregando">
              <p>Carregando suas mensagens...</p>
            </div>
          ) : mensagens.length === 0 ? (
            <div className="nenhuma-mensagem">
              <h3>Nenhuma mensagem encontrada</h3>
              <p>Você ainda não enviou nenhuma mensagem de suporte.</p>
            </div>
          ) : (
            mensagens.map((mensagem) => (
              <div 
                key={mensagem.id} 
                className={`mensagem-card ${mensagem.status === 'respondido' ? 'respondido' : 'pendente'} ${mensagemSelecionada?.id === mensagem.id ? 'selecionada' : ''}`}
                onClick={() => setMensagemSelecionada(mensagem)}
              >
                <div className="mensagem-header">
                  <div className="status-badge" style={{ backgroundColor: getStatusColor(mensagem.status) }}>
                    {getStatusTexto(mensagem.status)}
                  </div>
                  <span className="data-mensagem">
                    {formatarData(mensagem.created_at)}
                  </span>
                </div>

                <div className="mensagem-content">
                  <h4>{mensagem.opcaoSelecionada}</h4>
                  <p className="mensagem-texto">{mensagem.msgUser}</p>
                  
                  {mensagem.resposta && (
                    <div className="resposta-section">
                      <div className="resposta-header">
                        <strong>Resposta do Suporte</strong>
                        {mensagem.adminNome && (
                          <span className="admin-nome">por {mensagem.adminNome}</span>
                        )}
                        <span className="data-resposta">
                          {formatarData(mensagem.respostaData)}
                        </span>
                      </div>
                      <p className="resposta-texto">{mensagem.resposta}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {mensagemSelecionada && (
          <div className="modal-overlay" onClick={() => setMensagemSelecionada(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Detalhes da Mensagem</h2>
                <button 
                  className="fechar-modal"
                  onClick={() => setMensagemSelecionada(null)}
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="info-section">
                  <div className="info-item">
                    <strong>Status:</strong>
                    <span 
                      className="status-texto"
                      style={{ color: getStatusColor(mensagemSelecionada.status) }}
                    >
                      {getStatusTexto(mensagemSelecionada.status)}
                    </span>
                  </div>
                  <div className="info-item">
                    <strong>Data de envio:</strong>
                    <span>{formatarData(mensagemSelecionada.created_at)}</span>
                  </div>
                  <div className="info-item">
                    <strong>Categoria:</strong>
                    <span>{mensagemSelecionada.opcaoSelecionada}</span>
                  </div>
                </div>

                <div className="mensagem-section">
                  <h4>Sua mensagem:</h4>
                  <div className="mensagem-texto-box">
                    {mensagemSelecionada.msgUser}
                  </div>
                </div>

                {mensagemSelecionada.resposta ? (
                  <div className="resposta-section">
                    <h4>Resposta do suporte:</h4>
                    <div className="resposta-info">
                      {mensagemSelecionada.adminNome && (
                        <p><strong>Respondido por:</strong> {mensagemSelecionada.adminNome}</p>
                      )}
                      <p><strong>Data da resposta:</strong> {formatarData(mensagemSelecionada.respostaData)}</p>
                    </div>
                    <div className="resposta-texto-box">
                      {mensagemSelecionada.resposta}
                    </div>
                  </div>
                ) : (
                  <div className="sem-resposta">
                    <p>Sua mensagem ainda não foi respondida pela administração.</p>
                    <p>Por favor, aguarde enquanto nossa equipe analisa sua solicitação.</p>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button 
                  className="btn-fechar"
                  onClick={() => setMensagemSelecionada(null)}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        setModalOpen={() => setShowModal(!showModal)}
        codigoErro={codigoErro}
      />
      <Footer darkTheme={darkTheme} onChangeTheme={ChangeTheme}/>
    </main>
  );
}