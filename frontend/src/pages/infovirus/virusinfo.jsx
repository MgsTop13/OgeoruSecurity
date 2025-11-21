import BackgroundBlack from "/images/Black/BackgroundBlack.png";
import BackgroundWhite from "/images/White/BackgroundWhite.png";
import CardPublicacao from "../../components/card/card.jsx";
import Footer from "../../components/footer/index.jsx";
import Cabecalho2 from "../../components/HeaderPages";
import Modal from "../../components/err/index.jsx";
import { useState, useEffect } from "react";
import apiLink from "../../axios";
import "./virusinfo.scss";

export default function VR() {
  const [expandedCard, setExpandedCard] = useState(null);
  const [expandedDbCard, setExpandedDbCard] = useState(null);
  const [virusList, setVirusList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [codigoErro, setCodigoErro] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const virusData = [
    {
      name: "Ransomware",
      description:
        "Criptografa arquivos e exige resgate para liberá-los, afetando tanto usuários quanto empresas.",
      prevention:
        "Mantenha backups fora do sistema principal e use antivírus atualizado. Faça backups regulares em dispositivos externos e evite pagar resgates, pois não há garantia de recuperação dos dados.",
      expandedInfo:
        "Os ransomwares podem bloquear o acesso ao sistema operacional ou criptografar arquivos específicos. São frequentemente distribuídos via e-mails de phishing ou exploits em softwares desatualizados.",
    },
    {
      name: "Fileless Malware",
      description:
        "Opera diretamente na memória e utiliza ferramentas legítimas do sistema para evitar detecção.",
      prevention:
        "Mantenha o sistema atualizado e monitore atividades suspeitas em segundo plano. Use soluções de segurança especializadas em detecção de ataques fileless.",
      expandedInfo:
        "Diferente de malwares tradicionais, não escreve arquivos no disco, tornando a detecção mais difícil. Utiliza PowerShell, WMI ou outras ferramentas do sistema para executar código malicioso.",
    },
    {
      name: "Infostealers",
      description:
        "Rouba logins, cookies e dados bancários armazenados no navegador.",
      prevention:
        "Ative autenticação de dois fatores e nunca salve senhas diretamente no navegador. Use gerenciadores de senhas seguros e verifique regularmente extensões do navegador.",
      expandedInfo:
        "Pode capturar screenshots, gravar teclas pressionadas e acessar carteiras de criptomoedas. Muitas vezes vem disfarçado em softwares crackeados ou extensões de navegador maliciosas.",
    },
    {
      name: "Coinminers",
      description:
        "Usam sua CPU ou GPU para minerar criptomoedas sem permissão.",
      prevention:
        "Verifique picos de uso de CPU e bloqueie scripts de mineração com extensões. Monitore o desempenho do sistema regularmente.",
      expandedInfo:
        "Consome recursos do sistema, reduzindo desempenho e aumentando consumo de energia. Pode ser incorporado em sites através de JavaScript ou instalado como software disfarçado.",
    },
    {
      name: "Worms",
      description:
        "Replicam-se automaticamente pela rede explorando falhas de segurança.",
      prevention:
        "Mantenha firewall ativo e evite abrir anexos desconhecidos. Atualize regularmente todos os softwares e sistemas operacionais.",
      expandedInfo:
        "Capaz de se espalhar rapidamente sem interação do usuário. Pode criar backdoors, sobrecarregar redes e distribuir outros malwares.",
    },
    {
      name: "Malvertising",
      description:
        "Propagação de vírus por meio de anúncios aparentemente legítimos.",
      prevention:
        "Use bloqueadores de anúncios e evite clicar em banners suspeitos. Mantenha o navegador e plugins atualizados.",
      expandedInfo:
        "Pode infectar usuários sem necessidade de cliques através de exploits em anúncios. Sites legítimos podem ser comprometidos para exibir anúncios maliciosos.",
    },
    {
      name: "Scareware",
      description:
        "Simula alertas falsos para enganar o usuário a instalar malwares.",
      prevention:
        "Ignore mensagens alarmistas e use um antivírus confiável. Nunca compre software através de pop-ups não solicitados.",
      expandedInfo:
        "Finge ser software de segurança legítimo, exibindo falsas detecções de vírus para assustar usuários e fazê-los instalar malware.",
    },
    {
      name: "Trojans",
      description:
        "Disfarçam-se como software legítimo para enganar usuários.",
      prevention:
        "Baixe software apenas de fontes oficiais e verifique assinaturas digitais. Use firewall para monitorar conexões de saída.",
      expandedInfo:
        "Diferente de vírus, não se replica sozinho. Pode criar backdoors, roubar informações ou dar controle remoto do sistema a atacantes.",
    },
    {
      name: "Spyware",
      description:
        "Vírus que monitora secretamente suas atividades, coletando informações pessoais.",
      prevention:
        "Evite clicar em links ou anexos suspeitos e baixe programas apenas de fontes seguras. Mantenha o antivírus e o navegador sempre atualizados.",
      expandedInfo:
        "Para evitar o spyware, desconfie de sites com downloads estranhos ou pop-ups excessivos. Instale e mantenha um antivírus e antispyware sempre atualizados. Baixe aplicativos apenas de lojas oficiais e verifique permissões.",
    },
  ];

  const handleCardClick = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
    setExpandedDbCard(null);
  };

  const handleDbCardClick = (index) => {
    setExpandedDbCard(expandedDbCard === index ? null : index);
    setExpandedCard(null);
  };

  useEffect(() => {
    async function fetchVirus() {
      try {
        const res = await apiLink.get("/api/listarInf");
        setVirusList(res.data);
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
    fetchVirus();
  }, []);

  return (
    <main className={`MainVirus ${darkTheme ? "dark" : "light"}`}>
      <Cabecalho2 darkTheme={darkTheme} onChangeTheme={ChangeTheme} />
      <section className="virus-section">
        <h1>Tipos de Malware & Como se Proteger</h1>

        <div className="cards-grid">
          {virusData.map((virus, index) => (
            <article
              key={index}
              className={`virus-card ${
                expandedCard === index ? "expanded" : ""
              }`}
              onClick={() => handleCardClick(index)}
            >
              <header className="card-header">
                <h2>{virus.name}</h2>
                <p>{virus.description}</p>
              </header>
              <footer className="card-footer">
                <h3>Como se prevenir</h3>
                <p>
                  {expandedCard === index
                    ? virus.expandedInfo
                    : virus.prevention}
                </p>
              </footer>
            </article>
          ))}
        </div>

        <h2 style={{ marginTop: "2rem" }}></h2>
        <div className="cards-grid-bottom">
          {loading ? (
            <p>Carregando...</p>
          ) : virusList.length > 0 ? (
            virusList.map((virus, index) => (
              <CardPublicacao
                key={index}
                nome={virus.nome_virus}
                descricao={virus.descricao_virus}
                prevensao={virus.prevensao}
                isExpanded={expandedDbCard === index}
                onClick={() => handleDbCardClick(index)}
              />
            ))
          ) : (
            <p></p>
          )}
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