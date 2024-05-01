import { Redirect, Route } from 'react-router-dom'; // import for routing
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import ManageHabits from './pages/ManageHabits';
import TrackHabits from './pages/TrackHabits';
import Analyze from './pages/Analyze';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Login from './pages/Login';

setupIonicReact();

/*Routing setup!
This setup combines Ionic's tab-based navigation with React Router for handling routing within your application. 
It allows you to define different views for each tab and navigate between them seamlessly. */ 
const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
        <IonRouterOutlet> 
          <Route exact path="/Login"> 
            <Login />
          </Route>
          <Route exact path="/ManageHabits">
            <ManageHabits />
          </Route>
          <Route exact path="/TrackHabits">
            <TrackHabits />
          </Route>
          <Route path="/Analyze">
            <Analyze />
          </Route>
          <Route exact path="/">
            <Redirect to="/Login" />  
          </Route>
        </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
