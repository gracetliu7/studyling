import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {onCall, HttpsError} from "firebase-functions/v2/https";

admin.initializeApp();

export const collectEmail = functions.https.onCall(
  async (request: functions.https.CallableRequest<{email: string}>) => {
    const email = request.data.email;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "a valid email address is required",
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
      throw new functions.https.HttpsError(
        "internal",
        "Failed to save email.",
      );
    }
  },
);

export const validateCodeAndIncrement = onCall(
  {
    region: "us-central1",
  },
  async (request) => {
    const code = (
      request.data && request.data.code ? String(request.data.code) : ""
    ).trim();
    if (!code) {
      throw new HttpsError("invalid-argument", "code is required");
    }

    const db = admin.firestore();

    const snap = await db
      .collection("access-codes")
      .where("code", "==", code)
      .limit(1)
      .get();

    if (snap.empty) {
      throw new HttpsError("not-found", "incorrect code");
    }

    const docRef = snap.docs[0].ref;

    await db.runTransaction(async (tx) => {
      const doc = await tx.get(docRef);
      const current = Number(doc.get("usedCount")) || 0;
      tx.update(docRef, {usedCount: current + 1});
    });

    return {success: true};
  },
);
