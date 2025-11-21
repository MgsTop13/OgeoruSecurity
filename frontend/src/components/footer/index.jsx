import "./index.scss";
import { Link } from "react-router";

export default function Footer({ darkTheme, onChangeTheme }) {
    return (
        <footer className={`footer-home ${darkTheme ? "dark" : "light"}`}>
            <div className="footer-content">
                {/* Seção de Contatos */}
                <div className="footer-section">
                    <h3>Contatos</h3>
                    <div className="contact-info">
                        <div className="contact-item">
                            <span className="contact-label">Email:</span>
                            <a href="mailto:ogeoruss@gmail.com" className="contact-link">
                                ogeoruss@gmail.com
                            </a>
                        </div>
                        <div className="contact-item">
                            <span className="contact-label">Instagram:</span>
                            <a 
                                href="https://www.instagram.com/ogearus_security/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="contact-link"
                            >
                                @OgearusSecurity
                            </a>
                        </div>
                    </div>
                </div>

                {/* Seção de Links Úteis */}
                <div className="footer-section">
                    <h3>Links Úteis</h3>
                    <div className="footer-links">
                        <Link to="/Support" className="footer-link">Ajuda & Suporte</Link>
                        <Link to="/Updates" className="footer-link">Atualizações</Link>
                        <Link to="/Login" className="footer-link">Login</Link>
                        <Link to="/Pagamento" className="footer-link">Premium</Link>
                    </div>
                </div>

                {/* Seção de Segurança */}
                <div className="footer-section">
                    <h3>Segurança</h3>
                    <p className="security-text">
                        Protegendo seu mundo digital com ferramentas confiáveis e seguras.
                    </p>
                </div>

                {/* Seção do Tema (igual ao header) */}
                <div className="footer-section">
                    <h3>Informações</h3>
                    <Link to="/Sobre" className="footer-link">Sobre a Ogeorus</Link>
                </div>
            </div>

            {/* Copyright */}
            <div className="footer-bottom">
                <p>&copy; 2025 Ogeonus Security. Todos os direitos reservados.</p>
            </div>
        </footer>
    );
}