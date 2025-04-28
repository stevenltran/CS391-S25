
import { getMessaging, getToken } from "firebase/messaging";
import { db } from "./firebase";
import { doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export async function requestNotificationPermission() {
  console.log("Requesting notification permission...");

  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("Notification permission granted.");

      const messaging = getMessaging();
      const currentToken = await getToken(messaging, {
        vapidKey: "BLY2BMeZnaaM3Y5riTslRfRdpZkvDFBVcAfsMUZl_Z_PJo982YmvVo7ev3rH3TKkY6FKjLugMnT9GtDNaNNTT_0",
      });

      if (currentToken) {
        console.log("FCM Token:", currentToken);

        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, {
            fcmToken: currentToken,
          });
          console.log("Saved FCM token to Firestore.");
        } else {
          console.warn("No user signed in to save token.");
        }
      } else {
        console.warn("No registration token available. Request permission to generate one.");
      }
    } else {
      console.warn("Notification permission not granted.");
    }
  } catch (err) {
    console.error("An error occurred while getting permission or token:", err);
  }
}
