import { useState, useEffect, createContext, useContext } from "react";
import { createFirebaseApp } from "../firebase/clientApp";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, updateDoc, doc } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";

export const UserContext = createContext();

export default function UserContextComp({ children }) {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true); // Helpful, to update the UI accordingly.

    useEffect(() => {
        // Listen authenticated user
        const app = createFirebaseApp();
        const auth = getAuth(app);
        const unsubscriber = onAuthStateChanged(auth, async (user) => {
            try {
                if (user) {
                    // User is signed in.
                    const { uid, displayName, email, photoURL } = user;
                    const messaging = getMessaging(app);
                    getToken(messaging, {
                        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
                    }).then((currentToken) => {
                        if (currentToken) {
                            const firestore = getFirestore();
                            const userRef = doc(firestore, "users", uid);
                            updateDoc(userRef, {
                                notificationToken: currentToken,
                            }).then((res) => {
                                console.log("Updated user token", currentToken);
                            });
                        } else {
                            console.log(
                                "No registration token available. Request permission to generate one."
                            );
                        }
                    });
                    // You could also look for the user doc in your Firestore (if you have one):
                    // const userDoc = await firebase.firestore().doc(`users/${uid}`).get()
                    setUser({ uid, displayName, email, photoURL });
                } else setUser(null);
            } catch (error) {
                // Most probably a connection error. Handle appropriately.
            } finally {
                setLoadingUser(false);
            }
        });

        // Unsubscribe auth listener on unmount
        return () => unsubscriber();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loadingUser }}>
            {children}
        </UserContext.Provider>
    );
}

// Custom hook that shorthands the context!
export const useUser = () => useContext(UserContext);
