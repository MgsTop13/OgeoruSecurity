import BackgroundBlack from "/images/Black/BackgroundBlack.png";
import BackgroundWhite from "/images/White/BackgroundWhite.png";
import CabecalhoAdmin2 from "../../../components/headerAdmin2";
import Footer from "../../../components/footer/index.jsx";
import { useState, useEffect, use } from "react";
import { useNavigate } from "react-router";
import apiLink from "../../../axios.js";
import "./updateAdmin.scss";

export default function UpdateAdmin() {
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

    // Estado para os updates
    const [nmUpdate, setNmUpdate] = useState('');
    const [descUpdate, setDescUpdate] = useState('');
    const [dateUpdate, setDateUpdate] = useState();
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    function ChangeTheme() {
        setDarkTheme(prevTheme => !prevTheme)
    }

    // Carregar updates do backend
    async function InserirUpdate() {
        try {
            const response = await apiLink.post('/InserirUpdate', {
                "date": dateUpdate,
                "titulo": nmUpdate,
                "desc": descUpdate
            })
            alert('Update com sucesso!')
            setError("")
        } catch (error) {
            alert(error)
            console.error('Erro ao carregar inserir updates:', error)
            setError("Erro ao carregar as atualizações")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        document.body.style.backgroundImage = `url(${darkTheme ? BackgroundBlack : BackgroundWhite})`
    }, [darkTheme])

    useEffect(() => {
        localStorage.setItem("TemaEscuro", darkTheme.toString())
    }, [darkTheme])



    return (
        <main className={`MainAdminUpdate ${darkTheme ? "dark" : "light"}`}>
            <CabecalhoAdmin2 darkTheme={darkTheme} onChangeTheme={ChangeTheme} />
            
                <div className="cardUpdate1">
                    <h1 className="titleUpdate">Inserir Atualização</h1>

                    <div className="informations">
                        <h2 className="subTitleUpdate">Titulo</h2>
                        <input 
                            className="inputText" 
                            value={nmUpdate} 
                            onChange={(e) => setNmUpdate(e.target.value)} 
                            type="text" 
                            placeholder="Modo Preto" 
                        />
                        <h2 className="subTitleUpdate">Descrição</h2>
                        <textarea 
                            className="Text" 
                            value={descUpdate} 
                            onChange={(e) => setDescUpdate(e.target.value)} 
                            placeholder="Adicionado modo preto" 
                        />
                        <h2 className="subTitleUpdate">Data/Prévia</h2>
                        <input 
                            className="inputDate" 
                            value={dateUpdate} 
                            onChange={(e) => setDateUpdate(e.target.value)} 
                            type="date" 
                        />
                        <button className="buttton" onClick={InserirUpdate}>Enviar Atualização</button>
                    </div>
                </div>
                <Footer className="footer" darkTheme={darkTheme} onChangeTheme={ChangeTheme}/>
        </main>
    )
}