import RecuperadorDeSenhas from "./pages/recuperadorDeSenha/recuperador"
import PasswordGenerator from "./pages/passwordGenerate/password"
import AddVirus from "./pages/admin/infos/addInfosVirus.jsx"
import UpdateAdmin from "./pages/admin/updates/updateAdmin"
import UserSupport from "./pages/UserSupport/userSupport"
import MsgSupport from "./pages/admin/mensagens/mensagem"
import {BrowserRouter, Routes, Route} from "react-router"
import VerifyLinks from "./pages/verifylinks/verifylinks"
import HomeAdmin from "./pages/admin/home/homeAdmin"
import Pagamento from "./pages/pagamento/pagamento"
import Verify from "./pages/verifyarchiver/verify"
import Perfil from "./components/perfil/Perfil"
import Support from "./pages/support/support"
import VR from "./pages/infovirus/virusinfo"
import Updates from "./pages/updates/update"
import Cas from "./pages/cadastro/cadastro"
import Home from "./pages/home/home.jsx"
import Login from "./pages/login/Login"
import Sobre from "./pages/sobre/sobre"

export default function Rotas(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Sobre" element={<Sobre />} />
                <Route path="/RecuperadorDeSenhas" element={<RecuperadorDeSenhas />} />
                <Route path="/SupportAdmin" element={<MsgSupport />} />
                <Route path="/Admin" element={<HomeAdmin />} />
                <Route path="/UpdatesAdmin" element={<UpdateAdmin />} />
                <Route path="/VerifyArchiver" element={<Verify />} />
                <Route path="/VerifyLinks" element={<VerifyLinks />} />
                <Route path="/PasswordGenerator" element={<PasswordGenerator />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Cadastro" element={<Cas />}/>
                <Route path="/Support" element={<Support />}/>
                <Route path="/Perfil" element={<Perfil />}/>
                <Route path="/Viruspage" element={<VR />}/>
                <Route path="/Pagamento" element={<Pagamento />} />
                <Route path="/UserSupport" element={<UserSupport />} />
                <Route path="/Updates" element={<Updates />} />
                <Route path="/Addvirus" element={<AddVirus />} />
            </Routes>
        </BrowserRouter>
    )
}