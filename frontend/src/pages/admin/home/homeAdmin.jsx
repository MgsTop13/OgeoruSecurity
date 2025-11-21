import BackgroundBlack from "/images/Black/BackgroundBlack.png";
import BackgroundWhite from "/images/White/BackgroundWhite.png";
import CabecalhoAdmin from "../../../components/headerAdmin";
import Footer from "../../../components/footer/index.jsx";
import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import "./homeAdmin.scss";

export default function HomeAdmin() {
    const user = localStorage.getItem('User')
    const navigate = useNavigate() 
    
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

    useEffect(() => {
        if(user === "MgsTop13" || user === "Gustavo Max"){
            return
        } else{
            alert('Você não tem acesso!');
            navigate('/')
        }
    }, [user, navigate])

    return (
        <main className={`MainAdmin ${darkTheme ? "dark" : "light"}`}>
            <CabecalhoAdmin darkTheme={darkTheme} onChangeTheme={ChangeTheme} />

            <div className="NmAdmin">
                <h1 className="welcome">Bem vindo</h1>
                <h1 className="NmAdmin2">{user}</h1>
                <h1 className="welcome2">!</h1>
            </div>

            <section className="cards">
                {[
                    {
                        id: 1,
                        icon: "", // Ícone de mensagem
                        title: "Veja as Mensagens dos usuários!",
                        text: "Simplesmente sim, aceite que vai ter pessoas que não vai saber usar teu site",
                        link: "/SupportAdmin",
                        button: "Ver Mensagens"
                    },
                    {
                        id: 2,
                        icon: "", // Ícone de Update
                        title: "Inserir Atualizações",
                        text: "Inserir texto de novidades na parte de Atualizações",
                        link: "/UpdatesAdmin",
                        button: "Gerenciar Atualizações"
                    },
                    {
                        id: 3,
                        icon: "", 
                        title: "Vírus",
                        text: "Atualize os vírus da página de vírus",
                        link: "/Addvirus", 
                        button: "Gerenciar Vírus"
                    }
                ].map(card => (
                    <div key={card.id} className={`card-${card.id} ${darkTheme ? "dark" : "light"}`}>
                        <div className={`titlecard-${card.id}`}>
                            <img src={card.icon} />
                            <h2 className="cardTitle">{card.title}</h2>
                        </div>
                        <p className="subtitle">{card.text}</p>
                        <div className="button-container">
                            <Link to={card.link}>
                                <button>{card.button}</button>
                            </Link>
                        </div>
                    </div>
                ))}
            </section>
            <Footer darkTheme={darkTheme} onChangeTheme={ChangeTheme}/>
        </main>
    )
}