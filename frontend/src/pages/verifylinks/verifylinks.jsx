import BackgroundBlack from "/images/Black/BackgroundBlack.png";
import BackgroundWhite from "/images/White/BackgroundWhite.png";
import Footer from "../../components/footer/index.jsx";
import Cabecalho2 from '../../components/HeaderPages';
import Modal from "../../components/err/index.jsx";
import { useState, useEffect } from 'react';
import apiLink from '../../axios';
import '../../scss/global.scss';
import '../../scss/fonts.scss';
import './verifylinks.scss';

export default function VerifyLinks() {
  const [darkTheme, setDarkTheme] = useState(() => {
    const themeSaved = localStorage.getItem("TemaEscuro");
    return themeSaved ? themeSaved === 'true' : false;
  });

  const [limite, setLimite] = useState(null);
  const [mostrarModalPagamento, setMostrarModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [codigoErro, setCodigoErro] = useState(null);

  function ChangeTheme() {
    setDarkTheme(prevTheme => !prevTheme);
  }

  const [link, setLink] = useState('');
  const [user, setUser] = useState(localStorage.getItem('User'));
  const [resultado, setResultado] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [detalhes, setDetalhes] = useState(null);

  const isAdmin = user === "MgsTop13" || user === "Gustavo2";

  useEffect(() => {
    carregarLimite();
  }, []);

  async function carregarLimite() {
    const email = localStorage.getItem("Email");
    const user = localStorage.getItem("User");

    if (!email || !user) return;
    
    if (isAdmin) {
      setLimite({ maxLink: 9999 });
      return;
    }
    
    try {
      const response = await apiLink.get(`/api/VerificarLimiteLink/${email}`);
      setLimite(response.data);
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

  useEffect(() => {
    document.body.style.backgroundImage = `url(${darkTheme ? BackgroundBlack : BackgroundWhite})`;
  }, [darkTheme]);

  useEffect(() => {
    localStorage.setItem('TemaEscuro', darkTheme.toString());
  }, [darkTheme]);

  async function VerificarLogin() {
    const user = localStorage.getItem("User");
    const email = localStorage.getItem("Email");

    if (!user || user === "" || !email) {
      alert("Faça Login para continuar!");
      return;
    }

    if (!isAdmin && limite && limite.maxLink <= 0) {
      setMostrarModal(true);
      return;
    }

    if (!link) {
      alert('Insira um link!');
      return;
    }

    setCarregando(true);
    setDetalhes(null);

    try {
      let response;
      
      if (isAdmin) {
        response = await apiLink.post('/api/check-url', {
          url: link
        });
      } else {
        response = await apiLink.post('/api/check-url-com-limite', {
          url: link,
          email: email,
          nome: user
        });
        
        const dados = response.data;
        setLimite({
          maxLink: dados.limiteRestante
        });
      }

      const dados = response.data;

      if (dados.segura) {
        setResultado('SEGURO - Este site parece confiável');
      } else {
        setResultado('PERIGOSO - Evite este site!');
      }

      setDetalhes(dados.detalhes);

    } catch (error) {
      if (error.response?.status === 402) {
        if (error.response.data.tipo === "LIMITE_ATINGIDO") {
          setMostrarModal(true);
          setResultado('Limite de verificações atingido.');
        } else {
          setResultado('Erro ao processar verificação.');
        }
      } else {
        if (error.code === 'ERR_NETWORK' || error.message?.includes('CONNECTION_REFUSED')) {
          setCodigoErro('network');
        } else {
          const status = error.response?.status;
          setCodigoErro(status || 'default');
        }
        setShowModal(true);
        setResultado('Erro ao verificar link. Tente novamente.');
      }
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Enter") {
        VerificarLogin();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <main className={`MainVerifyLinks ${darkTheme ? "dark" : "light"} ${!isAdmin && limite?.maxLink === 0 ? 'limite-zero' : ''}`}>
      <Cabecalho2 className="Cabecalho2" darkTheme={darkTheme} onChangeTheme={ChangeTheme} />

      {!isAdmin && mostrarModalPagamento && (
        <div className="modal-overlay">
          <div className="modal-pagamento">
            <h3>Limite Esgotado!</h3>
            <p>Você utilizou todas as suas verificações gratuitas</p>
            <p>Infelizmente você atingiu o limite máximo de verificações de links. Para continuar protegendo sua segurança online, faça o upgrade para a versão premium.</p>
            <p>Premium inclui: Verificações ilimitadas + Análise avançada + Suporte prioritário</p>

            <div className="modal-botoes">
              <button
                disabled={loading}
                className="btn-pagar"
              >
                {loading ? 'Processando...' : 'Upgrade Premium - R$ 2,99'}
              </button>
              <button
                onClick={() => setMostrarModal(false)}
                className="btn-cancelar"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="page-Links">
        <div className="card-Links">
          {limite && (
            <div className={`info-limite ${!isAdmin && limite.maxLink === 0 ? 'zero' : ''}`}>
              <h4>
                {isAdmin ? (
                  <>ADMIN - Verificações Ilimitadas</>
                ) : limite.maxLink === 0 ? (
                  'Limite Esgotado!'
                ) : (
                  `Verificações Restantes: ${limite.maxLink}/5`
                )}
              </h4>
              
              {!isAdmin && limite.maxLink <= 2 && limite.maxLink > 0 && (
                <p className="aviso-limite">
                  Você está ficando sem verificações gratuitas!
                </p>
              )}
              
              {!isAdmin && limite.maxLink === 0 && (
                <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', opacity: '0.9' }}>
                  Vá na parte de pagamento para conseguir mais cotas!
                </p>
              )}
            </div>
          )}

          <div className="part1-Links">
            <h2>Verificador de Links</h2>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              type="text"
              placeholder={
                !isAdmin && limite?.maxLink === 0
                  ? 'Compre mais cotas para verificar links'
                  : 'https://sitealeatorio.com.br'
              }
              disabled={carregando || (!isAdmin && limite?.maxLink === 0)}
            />
          </div>

          <div className="part2-Links">
            <section className="info">
              <h3>Resultado:</h3>
              <pre className={`resultado ${resultado.includes('PERIGOSO') ? 'perigoso' : resultado.includes('SEGURO') ? 'seguro' : ''}`}>
                {carregando ? 'Analisando...' :
                  !isAdmin && limite?.maxLink === 0 ? 'Compre mais cotas para verificar links' :
                    resultado || 'Aguardando verificação...'}
              </pre>
            </section>

            {detalhes && (
              <div className="detalhes-analise">
                <h4>Detalhes:</h4>

                {detalhes.google && (
                  <div className="analise-item">
                    <strong>Google:</strong>
                    <span className={detalhes.google.segura ? 'texto-seguro' : 'texto-perigoso'}>
                      {detalhes.google.segura ? 'Seguro' : 'Perigoso'}
                    </span>
                  </div>
                )}

                {detalhes.minhaAnalise && (
                  <div className="analise-item">
                    <strong>Análise:</strong>
                    <span>Pontuação: {detalhes.minhaAnalise.pontosRisco}</span>
                    {detalhes.minhaAnalise.alertas && detalhes.minhaAnalise.alertas.map((alerta, index) => (
                      <div key={index} className="alerta">{alerta}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            className='button-verifyLinks'
            onClick={VerificarLogin}
            disabled={carregando || (!isAdmin && limite?.maxLink === 0)}
          >
            {carregando ? 'Verificando...' :
              !isAdmin && limite?.maxLink === 0 ? 'Upgrade Necessário' :
                'Verificar Link'}
          </button>
        </div>
      </section>

      <Modal
        isOpen={showModal}
        setModalOpen={() => setShowModal(!showModal)}
        codigoErro={codigoErro}
      />
      <Footer darkTheme={darkTheme} onChangeTheme={ChangeTheme}/>
    </main>
  );
}