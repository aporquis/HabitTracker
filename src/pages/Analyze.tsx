import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonTabBar, IonTabButton, IonIcon, IonLabel, IonAlert, IonInput, IonButton, IonList, IonItem, IonSelect, IonSelectOption } from '@ionic/react';
import { accessibilityOutline, sparklesOutline, barChartOutline, sparkles } from 'ionicons/icons';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, TooltipItem, ArcElement, Legend, BarElement, CategoryScale, LinearScale, ChartType, ChartOptions } from 'chart.js';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import db from '../firebaseConfig';
import './Analyze.css';

// Register ChartJS elements
ChartJS.register(ArcElement, Legend, BarElement, CategoryScale, LinearScale);

const Analyze: React.FC = () => {
    const [chartData, setChartData] = useState<any>();
    // Explicitly define selectedChart as a type of ChartType ('pie' or 'bar')
    const [selectedChart, setSelectedChart] = useState<ChartType>('pie');

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            if (user) {
                const q = query(collection(db, 'users'), where("userId", "==", user.uid));
                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const docs = snapshot.docs.map(doc => doc.data());
                    const completed = docs.filter(doc => doc.completed).length;
                    const notCompleted = docs.length - completed;
                    setChartData({
                        labels: ['Completed', 'Not Completed'],
                        datasets: [
                            {
                                data: [completed, notCompleted],
                                backgroundColor: ['#FF6384', '#36A2EB'],
                                hoverBackgroundColor: ['#FF6384', '#36A2EB']
                            }
                        ]
                    });
                });

                return () => unsubscribe();
            } else {
                setChartData(undefined);
            }
        });
    }, []);

    const getPieOptions = (): ChartOptions<'pie'> => ({
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(tooltipItem: TooltipItem<'pie'>) {
                        let total = tooltipItem.dataset.data.reduce((acc, current) => acc + (current ?? 0), 0);
                        const value = tooltipItem.raw as number;
                        const percentage = ((value / total) * 100).toFixed(2);
                        return `${tooltipItem.label}: ${percentage}%`;
                    }
                }
            }
        }
    });

    const getBarOptions = (): ChartOptions<'bar'> => ({
        // Define bar chart specific options here, if any
    });

    const getChartOptions = () => {
        if (selectedChart === 'pie') {
            return getPieOptions();
        } else {
            return getBarOptions();
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Analyze Your Habit Completions</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonSelect value={selectedChart} onIonChange={e => setSelectedChart(e.detail.value as ChartType)}>
                    <IonSelectOption value="pie">Pie Chart</IonSelectOption>
                    <IonSelectOption value="bar">Bar Chart</IonSelectOption>
                </IonSelect>
                {chartData && (
                    selectedChart === 'pie' ? 
                    <Pie data={chartData} options={getPieOptions()} /> : 
                    <Bar data={chartData} options={getBarOptions()} />
                )}
            </IonContent>
            <IonTabBar slot="bottom">      
          <IonTabButton tab="trackhabits" href="/TrackHabits">
            <IonIcon aria-hidden="true" icon={sparklesOutline} />
            <IonLabel>Track Habits</IonLabel>
          </IonTabButton>
          <IonTabButton tab="managehabits" href="/ManageHabits"> 
            <IonIcon aria-hidden="true" icon={accessibilityOutline} />
            <IonLabel>Manage Habits</IonLabel>
          </IonTabButton>
          <IonTabButton tab="analyze" href="/Analyze">
            <IonIcon aria-hidden="true" icon={barChartOutline} />
            <IonLabel>Analyze</IonLabel>
          </IonTabButton>
        </IonTabBar>
        </IonPage>
    );
};

export default Analyze;