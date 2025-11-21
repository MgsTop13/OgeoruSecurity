import '../../scss/global.scss'
import '../../scss/fonts.scss'
import './home.scss'
import apiLink from '../../axios'
import Cabecalho from "../../components/headerHome"
import Footer from '../../components/footer'
import BackgroundBlack from "/images/Black/BackgroundBlack.png"
import BackgroundWhite from "/images/White/BackgroundWhite.png"
import LinkWhiteMode from "/images/White/links_white1.png"
import LinkBlackMode from "/images/Black/link.png"
import PassToPassWhite from '/images/White/passo_a_passo_white1.png'
import PassToPassBlack from '/images/Black/passo-a-passo.png'
import ArchiveIcon from "/images/icons/iconarchive.png"
import MachineBlack from "/images/Black/machineBlack.png"
import Machine from "/images/White/machine.png"

import { Link } from "react-router"
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

export default function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState(false);
    const [darkTheme, setDarkTheme] = useState(() => {
        const themeSaved = localStorage.getItem("TemaEscuro");
        return themeSaved ? themeSaved === 'true' : false;
    })

    //Mudar tema escuro para claro
    function ChangeTheme() {
        setDarkTheme(prevTheme => !prevTheme)
    }

    //Background mudando de acordo com o tema escolhido
    useEffect(() => {
        document.body.style.backgroundImage = `url(${darkTheme ? BackgroundBlack : BackgroundWhite})`
    }, [darkTheme]);

    //Setar o modo escuro no localStorage
    useEffect(() => {
        localStorage.setItem('TemaEscuro', darkTheme.toString())
    }, [darkTheme])

    //Verificador de ADM - CORRIGIDO
    useEffect(() => {
        AdmVerificador();
    }, []); // Adicionei array de dependências vazio para executar apenas uma vez

    async function AdmVerificador() {
        try {
            const Token = localStorage.getItem('token');
            
            // Se não tem token, não faz requisição
            if (!Token) {
                console.log('Token não encontrado');
                return;
            }

            const response = await apiLink.post('/LoginADM', {
                'tokenInserido': Token
            });

            if (!response) {
                console.log('Resposta vazia');
                return;
            }

            const data = response.data || response;
            
            // Verifica se existe Usuario e se tem pelo menos um item
            if (!data.Usuario || !data.Usuario[0]) {
                console.log('Usuário não encontrado na resposta');
                return;
            }

            const usuario = data.Usuario[0];
            const nomeUsuario = usuario.nome;
            const emailUsuario = usuario.email;


            // CORREÇÃO: Condição correta para verificar admin
            if (
                (nomeUsuario === "MgsTop13" && emailUsuario === "mgs350084@gmail.com") ||
                (nomeUsuario === "Gustavo Max" && emailUsuario === "GUGU@gmx.com") ||
                nomeUsuario === "Vitu"
            ) {
                setUser(true);
                localStorage.setItem('User', nomeUsuario);
                localStorage.setItem('Email', emailUsuario);
            } else {
                setUser(false);
            }
        }
        catch (error) {
            console.log('Erro na verificação de admin: ' + error.message);
            setUser(false); // Garante que não seja admin em caso de erro
        }
    }

    return (
        <main className={`MainHome ${darkTheme ? "dark" : "light"}`}>
            <Cabecalho darkTheme={darkTheme} onChangeTheme={ChangeTheme} AdminVerify={user} />
            <section className="text">
                <h1>Proteja seu dispositivo com um clique!</h1>
                <h3>Verifique arquivos e links que causem danos.</h3>
                <h4>
                    Em um mundo cada vez mais conectado, proteger-se na internet deixou de ser uma opção e tornou-se uma necessidade. A exposição de dados pessoais, senhas e informações bancárias pode gerar sérios prejuízos e comprometer sua segurança. Nossas ferramentas de proteção foram desenvolvidas para garantir sua tranquilidade, oferecendo barreiras eficazes contra ataques virtuais e sites maliciosos. Ao utilizá-las, você navega com confiança e mantém seu mundo digital seguro. Escolher se proteger é escolher responsabilidade, segurança e paz de espírito.
                </h4>
            </section>

            <section className="cards">
                {[
                    {
                        id: 1,
                        icon: ArchiveIcon,
                        title: "Verificador de Arquivos",
                        text: "Envie um arquivo e iremos verificar se causa danos!",
                        link: "/VerifyArchiver",
                        button: "Envie seu Arquivo!"
                    },

                    {
                        id: 2,
                        icon: darkTheme ? LinkWhiteMode : LinkBlackMode,
                        title: "Links Confiáveis",
                        text: "Envie um link para analise",
                        link: "/Verifylinks",
                        button: "Envie seu link",
                    },

                    {
                        id: 3,
                        icon: darkTheme ? PassToPassWhite : PassToPassBlack,
                        title: "Instuções para se previnir",
                        text: "Dicas de como se previnir de vírus perigosos",
                        link: "/Viruspage",
                        button: "Se Proteja",
                    },

                    {
                        id: 4,
                        icon: darkTheme ? MachineBlack : Machine,
                        title: "Gerador de senhas",
                        text: "Um simples gerador de senha com alta segurança",
                        link: "/PasswordGenerator",
                        button: "Gere sua senha",
                    }
                ].map(card => (
                    <div key={card.id} className={`card-${card.id} ${darkTheme ? "dark" : "light"}`}>
                        <div className={`titlecard-${card.id}`}>
                            <img src={card.icon} />
                            <h2>{card.title}</h2>
                        </div>
                        <p>{card.text}</p>
                        <div className="button-container">
                            <Link to={card.link}>
                                <button>{card.button}</button>
                            </Link>
                        </div>
                    </div>
                ))}
            </section>

            <section className='infos'>
                <div className='Virus'>
                    <div className='o-que-e'>
                        <h1>O que é um vírus digital?</h1>
                        <p>
                        Os vírus digitais são programas criados com a intenção de modificar, danificar ou controlar sistemas sem o consentimento do usuário. Eles se infiltram em arquivos, e-mails, pendrives e sites aparentemente inofensivos, esperando o momento certo para agir. Uma vez executados, podem se multiplicar e se espalhar para outros dispositivos conectados. Muitos vírus tentam roubar informações pessoais, senhas e dados bancários, enquanto outros apenas deixam o sistema lento ou inutilizável. Assim como doenças biológicas, eles se aproveitam de “descuidos digitais” — como clicar em links suspeitos ou baixar programas piratas. Existem diversos tipos: trojans, worms, ransomwares, spywares e muito mais. A cada ano, novas variantes aparecem, se tornando mais inteligentes e difíceis de detectar. Por isso, entender como funcionam é o primeiro passo para se proteger. Um simples clique errado pode abrir a porta para grandes prejuízos.</p>
                    </div>
                    <div className='infos-previnir'>
                        <h1>Como se prevenir de vírus digitais?</h1>
                        <p>
                        A prevenção contra vírus digitais começa com bons hábitos e atenção. Nunca clique em links de origem duvidosa ou em mensagens com promessas milagrosas, como prêmios e sorteios. Sempre baixe programas apenas de sites oficiais e verificados. Mantenha seu sistema operacional e antivírus atualizados, pois isso impede que falhas conhecidas sejam exploradas. Evite abrir anexos de e-mails de desconhecidos e não use pendrives sem saber sua procedência. Utilize senhas fortes, misturando letras, números e símbolos, e evite repeti-las em vários sites. Desconfie de redes Wi-Fi públicas e use autenticação de dois fatores quando possível. Além disso, faça backup regular dos seus arquivos importantes. O segredo é simples: precaução e consciência digital. Ser cuidadoso hoje pode te poupar de dores de cabeça amanhã.
                        </p>
                    </div>
                </div>
                <div className='Links'>
                    <h1>Perigos dos Links desconhecidos!</h1>
                    <p>
                    Clicar em qualquer link que aparece na internet pode parecer inofensivo, mas é uma das armadilhas mais perigosas do mundo digital. Muitos desses links escondem vírus que roubam suas senhas, fotos e até seu dinheiro. Um simples clique pode dar acesso total do seu celular ou computador a criminosos. Eles podem usar suas contas, enganar seus amigos e destruir sua privacidade. Pense bem: vale a pena arriscar tudo por curiosidade? Sempre verifique a origem antes de clicar e desconfie de links enviados por estranhos ou com promessas milagrosas. Use antivírus e mantenha seus sistemas atualizados. A internet pode ser segura — se você for esperto. Um clique errado pode mudar tudo. Escolha a segurança, não o perigo. Compartilhe essa ideia com quem você ama, pois muitas vítimas só percebem o perigo depois que é tarde demais. A proteção começa com informação e responsabilidade. Sua atenção é o primeiro escudo contra o crime digital.
                    </p>
                </div>
            </section>
            <Footer darkTheme={darkTheme} onChangeTheme={ChangeTheme} />
        </main>
    )
} 