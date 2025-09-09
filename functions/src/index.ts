import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const collectEmail = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ email: string }>) => {
    const email = request.data.email;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "a valid email address is required"
      );
    }

    try {
      await admin.firestore().collection("mailingList").add({
        email,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
      return {success: true, message: "Email saved successfully!"};
    } catch (error) {
      console.error("Error writing email to Firestore:", error);
      throw new functions.https.HttpsError("internal", "Failed to save email.");
    }
  }
);
