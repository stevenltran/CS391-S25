/* eslint-disable */

const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onCall }    = require("firebase-functions/v2/https");
const admin        = require("firebase-admin");

admin.initializeApp();
const db        = admin.firestore();
const messaging = admin.messaging();

// every 1 minute, look for any event whose startTimestamp is 15m out and reminder15Sent===false
exports.sendEventReminders = onSchedule("every 1 minutes", async (event) => {
  const now        = admin.firestore.Timestamp.now();
  const fifteenMin = admin.firestore.Timestamp.fromMillis(now.toMillis() + 15 * 60 * 1000);

  // find all events that start between now and fifteenMin, and haven’t got a reminder yet
  const snap = await db.collection("events")
    .where("startTimestamp", ">=", now)
    .where("startTimestamp", "<=", fifteenMin)
    .where("reminder15Sent", "==", false)
    .get();

  for (const docSnap of snap.docs) {
    const ev = { id: docSnap.id, ...docSnap.data() };

    for (const uid of ev.rsvps || []) {
      // 1) push
      const userRef = db.collection("users").doc(uid);
      const user    = (await userRef.get()).data();
      if (user?.fcmToken) {
        await messaging.send({
          token: user.fcmToken,
          notification: {
            title: `Reminder: ${ev.title} starts soon`,
            body:   `Starting at ${ev.startTime}!`,
          },
        });
      }

      // 2) email (via mail extension)
      if (user?.email) {
        await db.collection("mail").add({
          to: [ user.email ],
          message: {
            subject: `🔔 ${ev.title} is starting soon`,
            text:    `Hi ${user.name||"there"},\n\nYour event "${ev.title}" begins at ${ev.startTime}.\n\n– SparkBytes`,
          }
        });
      }

      // 3) Firestore notification
      await db.collection("notifications").add({
        userId:    uid,
        title:     `Upcoming: ${ev.title}`,
        body:      `Your event "${ev.title}" starts in 15 minutes.`,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // mark it done
    await db.collection("events").doc(ev.id).update({ reminder15Sent: true });
  }

  return null;
});

// callable https://…/closeEvent
exports.closeEvent = onCall(async (req) => {
  const { eventId } = req.data;
  if (!eventId) throw new Error("Missing eventId");

  const evRef  = db.collection("events").doc(eventId);
  const evSnap = await evRef.get();
  if (!evSnap.exists) throw new Error("Event not found");
  const ev = evSnap.data();

  for (const uid of ev.rsvps || []) {
    const userRef = db.collection("users").doc(uid);
    const user    = (await userRef.get()).data();

    if (user?.fcmToken) {
      await messaging.send({
        token: user.fcmToken,
        notification: {
          title: `Closed: ${ev.title}`,
          body:  `The event "${ev.title}" has been closed.`,
        }
      });
    }

    if (user?.email) {
      await db.collection("mail").add({
        to: [ user.email ],
        message: {
          subject: `Event Closed: ${ev.title}`,
          text:    `Hi ${user.name||"there"},\n\nYour event "${ev.title}" has now closed.\n\n– SparkBytes`,
        }
      });
    }

    // also write to notifications
    await db.collection("notifications").add({
      userId:    uid,
      title:     `Closed: ${ev.title}`,
      body:      `The event "${ev.title}" has now closed.`,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  // you might also want to set ev.closed = true, so your front-end filters it out:
  await evRef.update({ closed: true });

  return { success: true };
});