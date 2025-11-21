import "./index.scss";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import Logo from "/images/icons/logod.png";
import AccountWhite from "/images/White/account.png"
import Account from "/images/Black/iconContaBlack.png"
import brightness from "/images/Black/brightness.png";
import brightnessWhite from "/images/White/brightnessWhite.png";
import menuWhite from "/images/White/menuWhite.png";
import Perfil from "../../components/perfil/Perfil";
import menuBlack from "/images/Black/menuBlack.png";
import closeBlack from "/images/Black/close.png";
import closeWhite from "/images/White/close.png";

export default function CabecalhoAdmin({ darkTheme, onChangeTheme }) {
    //Navegação
    const Navigate = useNavigate();
    
    // Conta:
    const [user, setUser] = useState(localStorage.getItem('User'));
    const [accountLogo, setAccountLogo] = useState(false);
    const accountRef = useRef(null); // Ref para o ícone de perfil

    // Menu hamburguer
    const [menuAberto, setMenuAberto] = useState(false);
    const [resolution, setResolution] = useState(window.innerWidth < 768);

    // Ref para o menu mobile (para o componente Perfil)
    const menuMobileRef = useRef(null);

    function MostarInfoConta() {
        setAccountLogo(!accountLogo);
        // Fecha o menu hamburguer quando abrir o perfil no mobile
        if (resolution) {
            setMenuAberto(false);
        }
    }

    const [img90Dg, setImg90Dg] = useState(false);
    function MoverImg() {
        if (img90Dg === false) {
            document.getElementById('imgsun').style.transform = 'rotate(220deg)';
            setImg90Dg(true);
        }
        else {
            document.getElementById('imgsun').style.transform = 'rotate(-25deg)';
            setImg90Dg(false)
        }
    }

    // Função para alternar o menu hamburguer
    function toggleMenu() {
        setMenuAberto(!menuAberto);
    }

    useEffect(() => {
        const handleResize = () => {
            setResolution(window.innerWidth < 768);
            // Fecha o menu quando redimensionar para desktop
            if (window.innerWidth >= 768) {
                setMenuAberto(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Fecha o menu quando clicar fora
    useEffect(() => {
        const handleClickFora = (e) => {
            if (menuAberto && !e.target.closest('.menu-hamburguer') && !e.target.closest('.menu-opcoes')) {
                setMenuAberto(false);
            }
        };

        document.addEventListener('click', handleClickFora);
        return () => document.removeEventListener('click', handleClickFora);
    }, [menuAberto]);

    return (
        <header className={`header-Admin ${darkTheme ? "dark" : "light"}`}>
            <img src={Logo} className="logo" alt="Logo" />

            {/* MOBILE - Menu Hamburguer */}
            {resolution && (
                <section className="opcoes cell">
                    {/* Menu Hamburguer - Agora alterna entre hamburguer e X */}
                    <div
                        className="menu-hamburguer"
                        onClick={toggleMenu}
                        style={{ marginRight: '15px' }}
                    >
                        <img
                            src={menuAberto
                                ? (darkTheme ? closeWhite : closeBlack) // X quando aberto
                                : (darkTheme ? menuWhite : menuBlack)   // Hamburguer quando fechado
                            }
                            alt={menuAberto ? "Fechar" : "Menu"}
                        />
                    </div>

                    {/* Modo Escuro/Claro */}
                    <div onClick={() => { onChangeTheme(); MoverImg(); }} className="column1">
                        <img
                            id="imgsun"
                            src={darkTheme ? brightnessWhite : brightness}
                            alt="Tema"
                        />
                    </div>

                    {/* Menu de Opções Dropdown */}
                    {menuAberto && (
                        <div className="menu-opcoes" ref={menuMobileRef}>
                            <Link className="link" to='/SupportAdmin' onClick={() => setMenuAberto(false)}>Suporte</Link>
                            <Link className="link" to={"/UpdatesAdmin"}>Atualizações</Link>
                            <Link className="link" to={"/"}>Home</Link>
                        </div>
                    )}
                </section>
            )}

            {/* DESKTOP - Header Normal */}
            {!resolution && (
                <section className="opcoes">

                    <div className="column3">
                        <Link className="link" to='/SupportAdmin' onClick={() => setMenuAberto(false)}>Suporte</Link>
                        <Link className="link" to={"/UpdatesAdmin"}>Atualizações</Link>
                        <Link className="link" to={"/"}>Home</Link>
                    </div>

                    <div onClick={() => { onChangeTheme(); MoverImg(); }} className="column1">
                        <img
                            id="imgsun"
                            src={darkTheme ? brightnessWhite : brightness}
                            alt="Tema"
                        />
                        <h3>{darkTheme ? "Modo Claro" : "Modo Escuro"}</h3>
                    </div>

                </section>
            )}

            {/* Componente Perfil (funciona tanto para mobile quanto desktop) */}
            {accountLogo && (
                <Perfil
                    onClose={() => setAccountLogo(false)}
                    // No mobile usa a ref do menu, no desktop usa a ref da conta
                    triggerRef={resolution ? menuMobileRef : accountRef}
                />
            )}
        </header>
    );
}