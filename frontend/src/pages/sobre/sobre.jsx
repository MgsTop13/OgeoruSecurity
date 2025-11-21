import BackgroundBlack from "/images/Black/BackgroundBlack.png";
import BackgroundWhite from "/images/White/BackgroundWhite.png";
import Cabecalho2 from "../../components/HeaderPages";
import Footer from '../../components/footer';
import { useEffect, useState } from 'react';
import '../../scss/global.scss';
import '../../scss/fonts.scss';
import './sobre.scss'

export default function Sobre() {
    const [darkTheme, setDarkTheme] = useState(() => {
        const themeSaved = localStorage.getItem("TemaEscuro");
        return themeSaved ? themeSaved === 'true' : false;
    })

    // Mudar tema escuro para claro
    function ChangeTheme() {
        setDarkTheme(prevTheme => !prevTheme)
    }

    // Background mudando de acordo com o tema escolhido
    useEffect(() => {
        document.body.style.backgroundImage = `url(${darkTheme ? BackgroundBlack : BackgroundWhite})`
    }, [darkTheme]);

    // Setar o modo escuro no localStorage
    useEffect(() => {
        localStorage.setItem('TemaEscuro', darkTheme.toString())
    }, [darkTheme])

    return (
        <main className={`MainSobre ${darkTheme ? "dark" : "light"}`}>
            <Cabecalho2 darkTheme={darkTheme} onChangeTheme={ChangeTheme} />
            
            <div className="sobre-container">
                {/* Seção de Informações da Empresa */}
                <section className="empresa-info">
                    <h1>Sobre a Ogeorus</h1>
                    
                    <div className="info-grid">
                        <div className="info-card">
                            <h2>Informações da Empresa</h2>
                            <div className="info-details">
                                <div className="info-item">
                                    <strong>Nome:</strong>
                                    <span>Ogeorus</span>
                                </div>
                                <div className="info-item">
                                    <strong>Tipo:</strong>
                                    <span>Segurança</span>
                                </div>
                                <div className="info-item">
                                    <strong>Ano criado:</strong>
                                    <span>2025</span>
                                </div>
                            </div>
                        </div>

                        <div className="info-card">
                            <h2>Contato</h2>
                            <div className="info-details">
                                <div className="info-item">
                                    <strong>Email:</strong>
                                    <a href="mailto:Ogeoruss@gmail.com">Ogeoruss@gmail.com</a>
                                </div>
                                <div className="info-item">
                                    <strong>Instagram:</strong>
                                    <span>@OgearusSecurity</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Seção do Surgimento da Empresa */}
                <section className="surgimento-section">
                    <h2>Surgimento da Empresa</h2>
                    <div className="surgimento-content">
                        <p>
                            Observamos que muitos usuários tentam baixar jogos ou outros softwares de forma ilegal, 
                            ou navegam sem um cuidado na hora de clicar em links desconhecidos, correndo riscos de 
                            sofrer com vírus e malwares.
                        </p>
                        <p>
                            Para resolver esse problema, criamos um site que procura proteger o usuário contra vírus 
                            e malwares, verificando links e arquivos suspeitos com o objetivo de informar ao usuário 
                            quaisquer problemas encontrados. Sabemos que muitos sites na internet não são confiáveis, 
                            então desenvolvemos uma plataforma que garante a segurança digital e bom estar mental 
                            dos nossos usuários.
                        </p>
                    </div>
                </section>

                {/* Seção de Comparação com Concorrentes */}
                <section className="comparacao-section">
                    <h2>Comparação com o Mercado</h2>
                    <div className="tabela-comparacao">
                        <table>
                            <thead>
                                <tr>
                                    <th>Recursos</th>
                                    <th>VirusTotal</th>
                                    <th>Outros Sites</th>
                                    <th>Ogeorus</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Verificação de Arquivos</td>
                                    <td>✓</td>
                                    <td>✓</td>
                                    <td>✓</td>
                                </tr>
                                <tr>
                                    <td>Verificação de Links</td>
                                    <td>✓</td>
                                    <td>✗</td>
                                    <td>✓</td>
                                </tr>
                                <tr>
                                    <td>Gerador de Senhas</td>
                                    <td>✗</td>
                                    <td>✗</td>
                                    <td>✓</td>
                                </tr>
                                <tr>
                                    <td>Guias de Prevenção</td>
                                    <td>✗</td>
                                    <td>✗</td>
                                    <td>✓</td>
                                </tr>
                                <tr>
                                    <td>Interface Amigável</td>
                                    <td>✗</td>
                                    <td>✗</td>
                                    <td>✓</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Seção de Missão e Valores */}
                <section className="missao-section">
                    <div className="missao-grid">
                        <div className="missao-card">
                            <h3>🎯 Nossa Missão</h3>
                            <p>
                                Proteger usuários contra ameaças digitais através de ferramentas 
                                acessíveis e educativas, promovendo uma navegação segura para todos.
                            </p>
                        </div>
                        <div className="missao-card">
                            <h3>👁️ Nossa Visão</h3>
                            <p>
                                Ser referência em segurança digital, tornando a internet um lugar 
                                mais seguro através da conscientização e tecnologia.
                            </p>
                        </div>
                        <div className="missao-card">
                            <h3>💎 Nossos Valores</h3>
                            <ul>
                                <li>Transparência nas análises</li>
                                <li>Compromisso com a segurança</li>
                                <li>Inovação constante</li>
                                <li>Educação digital</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>

            <Footer darkTheme={darkTheme} onChangeTheme={ChangeTheme} />
        </main>
    )
}