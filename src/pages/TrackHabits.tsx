import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonTabBar, IonTabButton, IonIcon, IonLabel, IonAlert, IonButton, IonList, IonItem } from '@ionic/react';
import { accessibilityOutline, sparklesOutline, barChartOutline } from 'ionicons/icons';
import { onSnapshot, query, collection, orderBy, where, updateDoc, doc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useHistory } from 'react-router-dom';
import db from '../firebaseConfig';
import './TrackHabits.css';
import { signOutUser } from '../authService';

interface Habit {
    id: string;
    habit: string;
    completed: boolean;
    priority: 'High' | 'Medium' | 'Low';
}

const priorityLevels = {
    High: 1,
    Medium: 2,
    Low: 3
};

const TrackHabits: React.FC = () => {
    const [tasks, setTasks] = useState<Habit[]>([]);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [selectedTask, setSelectedTask] = useState<Habit | null>(null);
    const [error, setError] = useState<string>('');
    const history = useHistory();

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const q = query(collection(db, 'users'), where("userId", "==", user.uid), orderBy('priority', 'asc'));
                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const fetchedTasks = snapshot.docs.map(doc => ({
                        ...doc.data() as Habit,
                        id: doc.id
                    })).sort((a, b) => priorityLevels[a.priority] - priorityLevels[b.priority]);
                    setTasks(fetchedTasks);
                }, (error) => {
                    console.error("Error fetching tasks:", error);
                    setError("Failed to fetch tasks due to permission issues. Please check your access rights.");
                });

                return () => unsubscribe();
            } else {
                setTasks([]);
                setError("User is not logged in.");
            }
        });
    }, []);

    useEffect(() => {
        const timer = setInterval(async () => {
            const now = new Date();
            if (now.getHours() === 1 && now.getMinutes() === 0) {
                for (let task of tasks) {
                    if (task.completed) {
                        await updateDoc(doc(db, "users", task.id), { completed: false });
                    }
                }
            }
        }, 60000);  // Check every minute

        return () => clearInterval(timer);
    }, [tasks]);

    const markCompletion = async (completed: boolean) => {
        if (selectedTask) {
            await updateDoc(doc(db, 'users', selectedTask.id), { completed });
            setShowAlert(false);
            setSelectedTask(null);
        }
    };

    const handleLogout = async () => {
        try {
          await signOutUser();
          history.push('/login');
        } catch (error) {
          console.error("Error signing out:", error);
        }
      };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                <IonButton slot="end" onClick={handleLogout}>Logout</IonButton>
                    <IonTitle>Track Your Habit Completions</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {error && <IonLabel color="danger">{error}</IonLabel>}
                <IonList>
                    {tasks.map(task => (
                        <IonItem key={task.id}>
                            <IonLabel>{task.habit} - {task.priority} Priority - <span style={{ color: task.completed ? 'green' : 'red' }}>{task.completed ? "Completed" : "Not Completed"}</span></IonLabel>
                            <IonButton onClick={() => { setSelectedTask(task); setShowAlert(true); }}>
                                Mark Completion
                            </IonButton>
                        </IonItem>
                    ))}
                </IonList>
                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header={`Confirm Completion for ${selectedTask?.habit}`}
                    message={`Did you complete this habit?`}
                    buttons={[
                        {
                            text: 'No',
                            handler: () => markCompletion(false)
                        },
                        {
                            text: 'Yes',
                            handler: () => markCompletion(true)
                        }
                    ]}
                />
            </IonContent>
            <IonTabBar slot="bottom">
                <IonTabButton tab="trackhabits" href="/TrackHabits">
                    <IonIcon icon={sparklesOutline} />
                    <IonLabel>Track Habits</IonLabel>
                </IonTabButton>
                <IonTabButton tab="managehabits" href="/ManageHabits">
                    <IonIcon icon={accessibilityOutline} />
                    <IonLabel>Manage Habits</IonLabel>
                </IonTabButton>
                <IonTabButton tab="analyze" href="/Analyze">
                    <IonIcon icon={barChartOutline} />
                    <IonLabel>Analyze</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonPage>
    );
};

export default TrackHabits;