import React, { useState, useEffect } from 'react';
import { IonContent, IonAlert, IonHeader, IonPage, IonTitle, IonToolbar, IonTabBar, IonTabButton, IonIcon, IonLabel, IonInput, IonButton, IonList, IonItem, IonSelect, IonSelectOption } from '@ionic/react';
import { accessibilityOutline, sparklesOutline, barChartOutline, sparkles } from 'ionicons/icons';
import { addDocument, fetchDocuments, updateDocument, deleteDocument } from '../firestoreService';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import './ManageHabits.css';

const ManageHabits: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [inputData, setInputData] = useState({ habit: '', priority: '' as 'High' | 'Medium' | 'Low', frequency: '' });
  const [user, setUser] = useState<any>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [frequencyError, setFrequencyError] = useState<string>('');

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const docs = await fetchDocuments("users");  // Assuming 'users' is your collection name
        setDocuments(docs);
      } else {
        setUser(null);
        setDocuments([]);  // Clear documents if logged out
      }
    });
    return () => unsubscribe();  // Clean up the subscription
  }, []);

  const handleAdd = async () => {
    if (!user) {
      console.log("User not authenticated");
      return;
    }
    if (parseInt(inputData.frequency, 10) > 7) {
      setFrequencyError("Frequency cannot be more than 7 days a week");
      return; // Stop the function if frequency is more than 7
    } else {
      setFrequencyError(''); // Clear the error message if the frequency is valid
    }
    try {
      await addDocument("users", { 
        habit: inputData.habit, 
        priority: inputData.priority, 
        frequency: parseInt(inputData.frequency, 10), 
        userId: user.uid 
      });
      await loadDocuments();
      setInputData({ habit: '', priority: '' as 'High' | 'Medium' | 'Low', frequency: '' });  // Reset input after adding
    } catch (error) {
      console.error("Failed to add document:", error);
    }
  };

  //calls fetchDocuments to fetch documents from Firestore
  const loadDocuments = async () => {
    if (!user) return;
    try {
      const docs = await fetchDocuments("users");
      setDocuments(docs);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    }
  };
  
  //updates a document in Firestore using the updateDocument function. It passes the collection name, document ID, and the new data for the document.
  const handleUpdate = async () => {
    if (!user || !selectedDocId) {
      console.log("No document selected or user not authenticated");
      return;
    }
    if (parseInt(inputData.frequency, 10) > 7) {
      setFrequencyError("Frequency cannot be more than 7 days a week");
      return; // Stop the function if frequency is more than 7
    } else {
      setFrequencyError(''); // Clear the error message if the frequency is valid
    }
    try {
      await updateDocument("users", selectedDocId, { 
        habit: inputData.habit, 
        priority: inputData.priority, 
        frequency: parseInt(inputData.frequency, 10) 
      });
      await loadDocuments();
      setInputData({ habit: '', priority: '' as 'High' | 'Medium' | 'Low', frequency: '' });  // Reset input after updating
      setSelectedDocId(null);  // Clear selection
    } catch (error) {
      console.error("Failed to update document:", error);
    }
  };

  //delete a document from Firestore using the deleteDocument function. It needs the collection name and the document ID to perform the deletion.
  const handleDelete = async (docId: string) => {
    if (!user) {
      console.log("User not authenticated");
      return;
    }
    try {
      await deleteDocument("users", docId);
      await loadDocuments();
    } catch (error) {
      console.error("Failed to delete document:", error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create, Update, Delete Habits</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonInput value={inputData.habit} placeholder="What's your Habit?" onIonChange={e => setInputData({ ...inputData, habit: e.detail.value! })}></IonInput>
        <IonSelect value={inputData.priority} placeholder="What's the Priority?" onIonChange={e => setInputData({ ...inputData, priority: e.detail.value as 'High' | 'Medium' | 'Low'})}>
                    <IonSelectOption value="High">High</IonSelectOption>
                    <IonSelectOption value="Medium">Medium</IonSelectOption>
                    <IonSelectOption value="Low">Low</IonSelectOption>
                </IonSelect>
        <IonInput value={inputData.frequency} type="number" placeholder="How frequent (Days) a week?" onIonChange={e => setInputData({ ...inputData, frequency: e.detail.value! })} max="7"></IonInput>        
        <IonButton onClick={handleAdd}>Add Habit</IonButton>
        {selectedDocId && <IonButton onClick={handleUpdate}>Update Document</IonButton>}
        {frequencyError && ( <div style={{ marginTop: '10px' }}> {/* Adjust styling as needed */} <IonLabel color="danger">{frequencyError}</IonLabel></div>
    )}
        <IonList>
          {documents.map(doc => (
            <IonItem key={doc.id}>
              <IonLabel>{doc.habit} for {doc.frequency} Day(s) a week (Priority: {doc.priority})</IonLabel>
              <IonButton onClick={() => { setInputData({ habit: doc.habit, priority: doc.priority, frequency: String(doc.frequency) }); setSelectedDocId(doc.id); }}>Select</IonButton>
              <IonButton color="danger" onClick={() => handleDelete(doc.id)}>Delete</IonButton>
            </IonItem>
          ))}
        </IonList>
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

export default ManageHabits;