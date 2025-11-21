import BackgroundBlack from "/images/Black/BackgroundBlack.png";
import BackgroundWhite from "/images/White/BackgroundWhite.png";
import Footer from "../../components/footer/index.jsx";
import Cabecalho2 from '../../components/HeaderPages';
import Modal from "../../components/err/index.jsx";
import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import apiLink from "../../axios";
import './Login.scss';

function Login() {
  const [darkTheme, setDarkTheme] = useState(() => {
    const themeSaved = localStorage.getItem("TemaEscuro");
    return themeSaved ? themeSaved === 'true' : false;
  })

  function ChangeTheme() {
    setDarkTheme(prevTheme => !prevTheme)
  }

  useEffect(() => {
    document.body.style.backgroundImage = `url(${darkTheme ? BackgroundBlack : BackgroundWhite})`
  }, [darkTheme]);

  const [codigoErro, setCodigoErro] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mostrar, setMostrar] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  
  async function Enviarlogin() {
    try {
      const resposta = await apiLink.post('/Login', {
        nome,
        email,
        senha
      });

      const token = resposta.data.token;
      const idCadastro = resposta.data.id_cadastro;
      
      localStorage.setItem("token", token);
      localStorage.setItem("User", nome);
      localStorage.setItem("Email", email);
      localStorage.setItem('id_cadastro', idCadastro);

      alert('Login feito com sucesso');
      navigate("/");
    } catch (error) {
      const status = error.response?.status; 
      setCodigoErro(status);
      setShowModal(true);
    }
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Enter") {
        Enviarlogin();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [nome, email, senha]);

  return (
    <main className={`MainLogin ${darkTheme ? "dark" : "light"}`}>
      <Cabecalho2 darkTheme={darkTheme} onChangeTheme={ChangeTheme} />
      <section className='conteiner-App'>
        <div className="fundo-secundario">
          <div className="login-fundo">
            <h1>Entrar</h1>
            <h2>Seja Bem-vindo de volta</h2>
          </div>
          <div className="conteiner-login">
            <input 
            className='um' 
            type="text" 
            placeholder="Nome/Apelido" 
            value={nome} 
            onChange={(e) => setNome(e.target.value)} 
            />
            <input 
            className='um' 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            />
          <div className="campo-senha">
            <input 
            className="input-senha"
            type={mostrar ? "text" : "password"} 
            placeholder="Senha" 
            value={senha} 
            onChange={(e) => setSenha(e.target.value)}
            />
            <button className="botao-visivel" onClick={() => setMostrar(!mostrar)}></button>
          </div>
          </div>
        </div>

        <section className='conteiner-link-botao'>
          <Link to="/Cadastro" className="link-login">Criar Conta!</Link>
          <Link className="link-login" to={"/RecuperadorDeSenhas"}>Esqueceu sua senha?</Link>
          <button className='botao' onClick={Enviarlogin}>Entrar</button>
        </section>
        <Modal isOpen={showModal} setModalOpen={() => setShowModal(!showModal)} codigoErro={codigoErro}></Modal>
      </section>
      <Footer darkTheme={darkTheme} onChangeTheme={ChangeTheme}/>
    </main>
  )
}
export default Login;