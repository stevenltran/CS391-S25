/* eslint-disable */

const {onSchedule} = require("firebase-functions/v2/scheduler");
const { onCall } = require("firebase-functions/v2/https");
const {getFirestore} = require("firebase-admin/firestore");
const {getMessaging} = require("firebase-admin/messaging");
const admin = require("firebase-admin");

admin.initializeApp();
const db = getFirestore();
const messaging = getMessaging();

function getEasternNowDateString() {
  const now = new Date();
  now.setHours(now.getHours() - 4); // Adjust -4h for Eastern (EDT)
  return now.toISOString().split("T")[0];
}

// This function checks for events that are starting within the next 15 minutes
// and sends reminders via FCM and email to users who have RSVP'd.
exports.sendEventReminders = onSchedule("every 1 minutes", async (event) => {
  console.log("Checking for upcoming events...");

  const nowDateString = getEasternNowDateString();
  console.log(`Today in Eastern Time: ${nowDateString}`);
  
  try {
    const eventsSnapshot = await db
        .collection("events")
        .where("date", ">=", nowDateString)
        .get();

    const events = eventsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`Found ${events.length} upcoming events`);

    for (const event of events) {
      if (!event.startTime || !event.date) {
        console.warn(`Skipping event without startTime/date: ${event.title}`);
        continue;
      }

      const [time, modifier] = event.startTime.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      // Convert 12-hour format to 24-hour
      if (modifier === "PM" && hours !== 12) {
        hours += 12;
      }
      if (modifier === "AM" && hours === 12) {
        hours = 0;
      }

      // Create event date assuming EST timezone
      const eventDate = new Date(event.date);
      eventDate.setHours(hours);
      eventDate.setMinutes(minutes);
      eventDate.setSeconds(0);
      eventDate.setMilliseconds(0);

      // Convert EST -> UTC (+4 hours offset)
      const eventStartUTC = new Date(eventDate.getTime() + 4 * 60 * 60 * 1000);
      const timeDiff = eventStartUTC.getTime() - Date.now();

      console.log(`Time till "${event.title}": ${Math.round(timeDiff / 1000)}`);

      if (timeDiff > 0 && timeDiff <= 15 * 60 * 1000 && !event.reminder15Sent) {
        console.log(`Sending reminder for event: ${event.title}`);

        const rsvps = event.rsvps || [];

        for (const userId of rsvps) {
          const userDoc = await db.collection("users").doc(userId).get();
          const userData = userDoc.data();

          if (userData?.fcmToken) {
            await messaging.send({
              token: userData.fcmToken,
              notification: {
                title: `${event.title}`,
                body: `Starting soon at ${event.startTime}!`,
              },
            });
            console.log(`Notification sent to user: ${userId}`);
          }

          // send email
          if (userData?.email) {
            await db.collection("mail").add({
              to: [userData.email],
              message: {
                subject: `Reminder: ${event.title} is starting soon!`,
                text: `Hi ${userData.name || "there"},\n\nYour event "${event.title}" is starting at ${event.startTime}.\n\nSee you there!\n\n- SparkBytes Team`,
                html: `
                  <div style="font-family: Arial, sans-serif; font-size: 16px;">
                    <p>Hi ${userData.name || "there"},</p>
                    <p>This is a reminder that your event <strong>${event.title}</strong> is starting soon at <strong>${event.startTime}</strong>.
                    Please head to ${event.location || "the location"} to claim your food! </p>
                    <p>We hope to see you there!</p>
                    <br/>
                    <p>- The SparkBytes Team</p>
                  </div>
                `,
              },
            });
            console.log(`Email queued for user: ${userId}`);
          } else {
            console.warn(`User ${userId} has no email`);
          }
          
        }

        await db.collection("events").doc(event.id).update({
          reminder15Sent: true,
        });
        console.log(`Marked event ${event.id} as reminder15Sent`);
      }
    }
  } catch (err) {
    console.error("Error sending reminders:", err);
  }

  return null;
});


// This function is triggered when an event is closed.
// It sends push notifications and emails to all users who have RSVP'd.
exports.closeEvent = onCall(async (request) => {
  const { eventId } = request.data;

  if (!eventId) {
    throw new Error("Missing eventId");
  }

  const eventRef = db.collection("events").doc(eventId);
  const eventDoc = await eventRef.get();
  const eventData = eventDoc.data();

  if (!eventData) {
    throw new Error("Event not found");
  }

  const rsvps = eventData.rsvps || [];

  for (const userId of rsvps) {
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.data();

    if (!userData) {
      console.warn(`User ${userId} not found`);
      continue;
    }

    // Send push notification if user has FCM token
    if (userData?.fcmToken) {
      await messaging.send({
        token: userData.fcmToken,
        notification: {
          title: "Event Closed",
          body: `The event "${eventData.title}" has now closed.`,
        },
      });
      console.log(`Push notification sent to user: ${userId}`);
    }

    // Send email if user has email
    if (userData?.email) {
      await db.collection("mail").add({
        to: [userData.email],
        message: {
          subject: `Closed: ${eventData.title}`,
          text: `Hi ${userData.name || "there"},\n\nSorry, but the event "${eventData.title}" has now closed.\n\n- SparkBytes Team`,
          html: `
            <div style="font-family: Arial, sans-serif; font-size: 16px;">
              <p>Hi ${userData.name || "there"},</p>
              <p>The event <strong>${eventData.title}</strong> has now closed.</p>
              <p>Thank you for being part of SparkBytes! We hope to see you again soon.</p>
              <br/>
              <p>- The SparkBytes Team</p>
            </div>
          `,
        },
      });
      console.log(`Email queued for user: ${userId}`);
    } else {
      console.warn(`User ${userId} has no email`);
    }
  }

  return { success: true };
});