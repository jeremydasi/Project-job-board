import CustomInput from '../components/customInput';
import Button from '../components/button';
import '../styles/postule.css';
import { useNavigate } from 'react-router-dom';
import ButtonLog from '../components/button/buttonLog';

function Postule() {
    const navigate = useNavigate();

    return (
        <div className='containerPostule'>
            <div className='containerFormPostule'>
                <div>
                    <h1 className='titlePostule'>Vérifier vos informations de candidature</h1>

                    <div className='containerInputPostule'>
                        <h2 className='titleForm'>Indiquez vos coordonnées</h2>

                        <CustomInput label="Prénom" className="inputPostule"/>
                        <CustomInput label="Nom de famille" className="inputPostule"/>
                        <CustomInput label="Adresse mail" className="inputPostule"/>
                        <CustomInput label="Numéro de téléphone" className="inputTel"/>
                    </div>

                    <div className='containerButtonPostule'>
                        <ButtonLog label='Précédent' onClick={() => navigate("/")} />
                        <ButtonLog label='Continuer' onClick={() => navigate("/")} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Postule;