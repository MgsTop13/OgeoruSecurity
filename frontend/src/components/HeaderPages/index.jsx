import "./index.scss"
import { Link } from 'react-router';
import React, { useEffect, useState } from 'react';
import Logo from "/images/icons/logod.png";
import BackgroundBlack from "/images/Black/BackgroundBlack.png"
import BackgroundWhite from "/images/White/BackgroundWhite.png"
import brightness from "/images/Black/brightness.png"
import brightnessWhite from "/images/White/brightnessWhite.png"

export default function Cabecalho2({ darkTheme, onChangeTheme }) {

    const [img90Dg, setImg90Dg] = useState(false)
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

    return (
        <header id="header" className={`header-pages ${darkTheme ? "dark" : "light"}`}>
            <img className="logo" src={Logo} />

            <section className="opcoes">
                <div onClick={() => { onChangeTheme(); MoverImg(); }} className="column1">
                    <img
                        id="imgsun"
                        src={darkTheme ? brightnessWhite : brightness}
                    />
                    <h3>{darkTheme ? "Modo Claro" : "Modo Escuro"}</h3>
                </div>

                <div className="column2">
                    <h3 id="h3"><Link id="link" className='link' to={'/'}>Voltar</Link></h3>
                </div>


            </section>
        </header>
    )
}