import BackgroundBlack from "/images/Black/BackgroundBlack.png";
import BackgroundWhite from "/images/White/BackgroundWhite.png";
import Footer from "../../components/footer/index.jsx";
import Cabecalho2 from "../../components/HeaderPages";
import Modal from "../../components/err/index.jsx";
import Mgs from "/images/icons/MgsPensativo.png";
import { useState, useEffect } from "react";
import apiLink from "../../axios";
import "./update.scss";

export default function Updates() {
    const [darkTheme, setDarkTheme] = useState(() => {
        const themeSaved = localStorage.getItem("TemaEscuro");
        return themeSaved ? themeSaved === "true" : false;
    });

    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [codigoErro, setCodigoErro] = useState(null);

    function ChangeTheme() {
        setDarkTheme(prevTheme => !prevTheme);
    }

    async function carregarUpdates() {
        try {
            setLoading(true);
            const response = await apiLink.get("/ListarUpdates");
            setUpdates(response.data.updates || []);
        } catch (error) {
            if (error.code === 'ERR_NETWORK' || error.message?.includes('CONNECTION_REFUSED')) {
                setCodigoErro('network');
            } else {
                const status = error.response?.status;
                setCodigoErro(status || 'default');
            }
            setShowModal(true);
            setUpdates([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarUpdates();
    }, []);

    useEffect(() => {
        document.body.style.backgroundImage = `url(${darkTheme ? BackgroundBlack : BackgroundWhite})`;
    }, [darkTheme]);

    useEffect(() => {
        localStorage.setItem("TemaEscuro", darkTheme.toString());
    }, [darkTheme]);

    function formatarData(data) {
        if (!data) return "Data não informada";
        if (typeof data === "string" && data.includes("/")) return data;

        try {
            const dataObj = new Date(data);
            return dataObj.toLocaleDateString("pt-BR");
        } catch {
            return data;
        }
    }

    return (
        <main className={`MainUpdate ${darkTheme ? "dark" : "light"}`}>
            <Cabecalho2 darkTheme={darkTheme} onChangeTheme={ChangeTheme} />

            <section className="cardUpdate">
                <div className="cardUpdate1">
                    <h1 className="titleUpdate">Novidades e atualizações</h1>

                    <div className="informations">
                        <h2 className="subTitleUpdate">O que mudou?</h2>

                        {loading && (
                            <div className="loading">
                                <h4 className="text">Carregando atualizações...</h4>
                            </div>
                        )}

                        {!loading && updates.length === 0 && (
                            <div className="empty">
                                <h4 className="text">Nenhuma atualização disponível</h4>
                            </div>
                        )}

                        {!loading && updates.map(update => (
                            <div className="date1" key={update.id}>
                                <h3 className="date">{formatarData(update.dataFormatada || update.DiadoUpdate)}</h3>
                                <h4 className="text">{update.titulo}</h4>
                                <h5 className="text2">{update.descricao}</h5>
                            </div>
                        ))}
                    </div>

                    <div className="Mgs">
                        <img src={Mgs} className="Mgs2" alt="MGS Pensativo" />
                    </div>
                </div>
            </section>

            <Modal
                isOpen={showModal}
                setModalOpen={() => setShowModal(!showModal)}
                codigoErro={codigoErro}
            />
            <Footer  darkTheme={darkTheme} onChangeTheme={ChangeTheme}/>
        </main>
    );
}