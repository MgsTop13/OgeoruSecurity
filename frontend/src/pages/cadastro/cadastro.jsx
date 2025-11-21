import BackgroundBlack from "/images/Black/BackgroundBlack.png";
import BackgroundWhite from "/images/White/BackgroundWhite.png";
import Cabecalho from '../../components/HeaderPages';
import Footer from "../../components/footer/index";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Modal from "../../components/err";
import { Link } from 'react-router';
import apiLink from '../../axios';
import './cadastro.scss';

function Cas() {
  //Modo escuro:
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

  useEffect(() => {
    localStorage.setItem('TemaEscuro', darkTheme.toString())
  }, [darkTheme])

  //Status Err:
  const [codigoErro, setCodigoErro] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mostrar, setMostrar] = useState(false);


  //Cadastro:
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    palavra: "",
    confirmarSenha: "",
    idade: ""
  })

  function validarEmail(email) {
    const Regex = [
      /^[^\s@]+@gmail\.com$/,
      /^[^\s@]+@outlook\.com$/,
      /^[^\s@]+@yahoo\.com$/,
      /^[^\s@]+@hotmail\.com$/,
      /^[^\s@]+@icloud\.com$/,
      /^[^\s@]+@protonmail\.com$/,
      /^[^\s@]+@live\.com$/,
      /^[^\s@]+@zoho\.com$/,
      /^[^\s@]+@gmx\.com$/,
      /^[^\s@]+@yandex\.com$/,
      /^[^\s@]+@aol\.com$/
    ];
    return Regex.some(regex => regex.test(email));
  }

  const navigate = useNavigate()
  

  const F = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const FF = async () => {
    if (!validarEmail(form.email)) {
      alert('O email precisa ser válido!');
      return;
    }
    if (!form.senha || form.senha.length < 8) {
      alert("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (form.senha !== form.confirmarSenha) {
      alert('As senhas não são iguais!');
      return;
    }
    if (!form.nome || !form.palavra || !form.idade) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    try {
      await apiLink.post("/registro", form)
      alert("Usuário cadastrado com sucesso!")
      navigate("/Login")
    } catch (error) {

      if (error.code === 'ERR_NETWORK' || error.message?.includes('CONNECTION_REFUSED')) {
        setCodigoErro('network');
        setShowModal(true);
        return;
      }

      const status = error.response?.status;

      setCodigoErro(status || 'default');
      setShowModal(true);
    }
  }
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Enter") {
        FF();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [form]);

  return (
    <main className={`MainCadastro ${darkTheme ? "dark" : "light"}`}>
      <Cabecalho darkTheme={darkTheme} onChangeTheme={ChangeTheme} />
      <section className='fundo'>
        <div className="fundo-secundario-cadastro">
          <div className="cadastro-fundo">
            <h1>Cadastro</h1>
            <h2>Crie sua Conta! Para melhorar sua experiência</h2>
          </div>
          <div className="conteiner-cadastro">
            <input type="text" name='nome' placeholder="Nome" value={form.nome} onChange={F} />
            <input type="email" name='email' placeholder="Email" value={form.email} onChange={F} />
            <div className="senhas">
              <input
                className='input-senha'
                type={mostrar ? "text" : "password"}
                name='senha'
                placeholder="Senha"
                value={form.senha}
                onChange={F}
              />
              <button className="botao-visivel" onClick={() => setMostrar(!mostrar)}></button>
            </div>
            <div className='senhas'>
              <input
                className='input-senha'
                type={mostrar ? "text" : "password"}
                name='confirmarSenha'
                placeholder="Confirmar Senha"
                value={form.confirmarSenha}
                onChange={F}
              />
              <button className="botao-visivel" onClick={() => setMostrar(!mostrar)}></button>
            </div>
            <div className='separados'>
              <input 
              type="text" 
              className='separado' 
              name='palavra' 
              placeholder="Palavra de Segurança" 
              value={form.palavra} 
              onChange={F} 
              />
              <input 
              type="date" 
              className='data'
              name='idade' 
              value={form.idade} 
              onChange={F} 
              />
            </div>
          </div>
        <div className='conteiner-link-botao-cas'>
          <div className='fundo-botao'>
            <p className='texto'>Pronto! Agora que tem uma conta <br /> faça o <Link className='Link' to={'/Login'}>Login</Link>!</p>
            <button className='botao' onClick={FF}>Cadastrar</button>
            <Modal isOpen={showModal} setModalOpen={() => setShowModal(!showModal)} codigoErro={codigoErro} />
          </div>
        </div>
        </div>
      </section>
      <Footer darkTheme={darkTheme} onChangeTheme={ChangeTheme}/>
    </main>
  )
}
export default Cas;