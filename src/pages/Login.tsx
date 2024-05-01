import React, { useState } from 'react';
import { IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useHistory } from 'react-router-dom';  //useHistory is a hook provided by react-router-dom that lets you access the history instance used for navigation
import { logInOutline } from 'ionicons/icons';
import LoginImage from '../assets/LoginImage.png'; 
import { signInWithGoogle } from '../authService'; // Import the signInWithGoogle function

const Login: React.FC = () => {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const history = useHistory();

    const handleGoogleLogin = async () => {
        try {
            const user = await signInWithGoogle();
            console.log('User signed in:', user);
            history.replace('/TrackHabits'); // This will navigate to TrackHabits page and replace the current entry in the history stack.
        } catch (error) {
            console.error('Login failed:', error);
            setErrorMessage("Failed to log in. Please try again.");
        }
    };

    return (
        <IonPage>
            <IonHeader className= "ion-text-center">
                <IonToolbar color={'primary'}>
                    <IonTitle>Habit Tracker</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <div className="ion-text-center ion-padding-top ion-margin-top">
                    <img src={LoginImage} alt='healthy habits icon'/>
                </div>
                <IonCard>
                    <IonCardContent className="ion-padding">
                        <IonButton color={'secondary'} expand='block' className='ion-margin-top' onClick={handleGoogleLogin}>
                            Sign in with Google
                            <IonIcon icon={logInOutline} slot="end" />
                        </IonButton>
                        {errorMessage && ( // This will render the error message when it's not an empty string
                            <div className="error-message">
                            {errorMessage}
                            </div>
                        )}
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default Login;