import BackgroundBlack from "/images/Black/BackgroundBlack.png";
import BackgroundWhite from "/images/White/BackgroundWhite.png";
import Footer from "../../components/footer/index.jsx";
import Cabecalho2 from '../../components/HeaderPages';
import Modal from "../../components/err/index.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import apiLink from "../../axios.js";
import './pagamento.scss';

export default function Pagamento() {
    const navigate = useNavigate();

    const [darkTheme, setDarkTheme] = useState(() => {
        const themeSaved = localStorage.getItem("TemaEscuro");
        return themeSaved ? themeSaved === 'true' : false;
    });

    function ChangeTheme() {
        setDarkTheme(prevTheme => !prevTheme);
    }

    useEffect(() => {
        document.body.style.backgroundImage = `url(${darkTheme ? BackgroundBlack : BackgroundWhite})`;
    }, [darkTheme]);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = () => {
        const user = localStorage.getItem("User");
        const token = localStorage.getItem("token");
        if (user && token) {
            setIsLoggedIn(true);
            setUserName(user);
        } else {
            setIsLoggedIn(false);
            setUserName('');
        }
    };

    const [paymentMethod, setPaymentMethod] = useState('pix');
    const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [pixCode] = useState(generatePixCode());
    const orderTotal = 2.99;

    const [showModal, setShowModal] = useState(false);
    const [codigoErro, setCodigoErro] = useState(null);

    useEffect(() => {
        if (!isLoggedIn) return;

        async function ProcessarPagamento() {
            try {
                const EmailUser = localStorage.getItem("Email");
                const respostaAPI = await apiLink.put('/InserirPagamento', { email: EmailUser });
            } catch (error) {
                if (error.code === 'ERR_NETWORK' || error.message?.includes('CONNECTION_REFUSED')) {
                    setCodigoErro('network');
                } else {
                    const status = error.response?.status;
                    setCodigoErro(status || 'default');
                }
                setShowModal(true);
            }
        }

        if (paymentMethod === 'pix' && paymentStatus === 'processing') {
            const timer = setTimeout(() => {
                const success = Math.random() > 0.2;
                setPaymentStatus(success ? 'paid' : 'pending');

                if (success) {
                    ProcessarPagamento();
                }
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [paymentStatus, paymentMethod, isLoggedIn]);

    function generatePixCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 32; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    const handleCardInput = (e) => {
        const { name, value } = e.target;
        setCardData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isLoggedIn) {
            alert('Você precisa estar logado para realizar o pagamento!');
            return;
        }

        if (paymentMethod === 'credit') {
            if (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv) {
                alert('Preencha todos os dados do cartão');
                return;
            }
            setPaymentStatus('paid');
        } else if (paymentMethod === 'pix') {
            setPaymentStatus('processing');
        }
    };

    const formatCardNumber = (value) => value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
    const formatExpiry = (value) => value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <main className={`mainPagamento ${darkTheme ? 'dark' : 'light'}`}>
            <Cabecalho2 darkTheme={darkTheme} onChangeTheme={ChangeTheme} />

            <div className="payment-page">
                <h1>Finalizar Pagamento</h1>

                {!isLoggedIn && (
                    <div className="login-required">
                        <div className="login-message">
                            <h3>🔒 Acesso Restrito</h3>
                            <p>Você precisa estar logado para acessar esta página.</p>
                            <button className="login-button" onClick={handleLoginRedirect}>
                                Fazer Login
                            </button>
                        </div>
                    </div>
                )}

                {isLoggedIn && (
                    <div className="payment-container">
                        <div className="user-info">
                            <p>👋 Olá, <strong>{userName}</strong></p>
                        </div>

                        <div className="order-summary">
                            <h3>Resumo do Pedido</h3>
                            <div className="total">
                                <span>Total:</span>
                                <span>R$ {orderTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        {paymentStatus === 'processing' && (
                            <div className="payment-status processing">
                                ⏳ Aguardando confirmação do pagamento...
                            </div>
                        )}

                        {paymentStatus === 'paid' && (
                            <div className="payment-status paid">
                                ✅ Pagamento confirmado! Obrigado pela compra.
                            </div>
                        )}

                        {paymentStatus !== 'paid' && (
                            <div className="payment-methods">
                                <h3>Método de Pagamento</h3>

                                <div className="method-options">
                                    <label className="method-option">
                                        <input
                                            type="radio"
                                            value="pix"
                                            checked={paymentMethod === 'pix'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <span>PIX</span>
                                    </label>

                                    <label className="method-option">
                                        <input
                                            type="radio"
                                            value="credit"
                                            checked={paymentMethod === 'credit'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <span>Cartão de Crédito</span>
                                    </label>
                                </div>

                                {paymentMethod === 'pix' && (
                                    <div className="pix-section">
                                        <div className="pix-code">
                                            <p><strong>Chave PIX:</strong></p>
                                            <div className="code-display">{pixCode}</div>
                                            <button
                                                type="button"
                                                className="copy-button"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(pixCode);
                                                    alert('Chave PIX copiada!');
                                                }}
                                            >
                                                Copiar Chave PIX
                                            </button>
                                        </div>

                                        <div className="pix-instructions">
                                            <h4>Como pagar:</h4>
                                            <ol>
                                                <li>Copie a chave PIX acima</li>
                                                <li>Abra seu app de banco</li>
                                                <li>Cole a chave no campo PIX</li>
                                                <li>Confirme o valor de R$ {orderTotal.toFixed(2)}</li>
                                                <li>Coloque seu nome e email na mensagem pix</li>
                                                <li>Finalize o pagamento</li>
                                            </ol>
                                        </div>

                                        <button
                                            className="submit-button"
                                            onClick={handleSubmit}
                                            disabled={paymentStatus === 'processing'}
                                        >
                                            {paymentStatus === 'processing' ? 'Verificando...' : 'Já fiz o PIX'}
                                        </button>
                                    </div>
                                )}

                                {paymentMethod === 'credit' && (
                                    <form onSubmit={handleSubmit} className="card-form">
                                        <div className="form-row">
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                name="number"
                                                placeholder="Número do Cartão"
                                                value={formatCardNumber(cardData.number)}
                                                onChange={(e) => {
                                                    const rawValue = e.target.value.replace(/\D/g, '');
                                                    if (rawValue.length <= 16) {
                                                        handleCardInput({
                                                            target: { name: 'number', value: rawValue }
                                                        });
                                                    }
                                                }}
                                                maxLength="19"
                                                required
                                            />
                                        </div>

                                        <div className="form-row">
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Nome no Cartão"
                                                value={cardData.name}
                                                onChange={handleCardInput}
                                                required
                                            />
                                        </div>

                                        <div className="form-row double">
                                            <input
                                                type="text"
                                                name="expiry"
                                                placeholder="MM/AA"
                                                value={formatExpiry(cardData.expiry)}
                                                onChange={(e) => {
                                                    const rawValue = e.target.value.replace(/\D/g, '');
                                                    if (rawValue.length <= 4) {
                                                        handleCardInput({
                                                            target: { name: 'expiry', value: rawValue }
                                                        });
                                                    }
                                                }}
                                                maxLength="5"
                                                required
                                            />
                                            <input
                                                type="text"
                                                name="cvv"
                                                placeholder="CVV"
                                                value={cardData.cvv}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, '');
                                                    if (value.length <= 3) {
                                                        handleCardInput({
                                                            target: { name: 'cvv', value }
                                                        });
                                                    }
                                                }}
                                                maxLength="3"
                                                required
                                            />
                                        </div>

                                        <div className="form-row">
                                            <select>
                                                <option>1x de R$ {orderTotal.toFixed(2)}</option>
                                                <option>2x de R$ {(orderTotal / 2).toFixed(2)}</option>
                                                <option>3x de R$ {(orderTotal / 3).toFixed(2)}</option>
                                            </select>
                                        </div>

                                        <button type="submit" className="submit-button">
                                            Pagar com Cartão
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Modal
                isOpen={showModal}
                setModalOpen={() => setShowModal(!showModal)}
                codigoErro={codigoErro}
            />
            <Footer darkTheme={darkTheme} onChangeTheme={ChangeTheme}/>
        </main>
    );
}