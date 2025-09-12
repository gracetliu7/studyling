    // Import Firebase
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
    import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs, doc, runTransaction } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
  
    const firebaseConfig = {
      apiKey: "AIzaSyAd1UJrE9LFvNOI6jp9am1eyHQLDL5Ll8Q",
      authDomain: "studyling-6fada.firebaseapp.com",
      projectId: "studyling-6fada",
      storageBucket: "studyling-6fada.appspot.com",
      messagingSenderId: "426130916056",
      appId: "1:426130916056:web:76862156edde2100adcdad"
    };
  
    // Init Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
  
    // Handle form submit
    document.getElementById("email-signup-form").addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const emailInput = document.getElementById("email-input");
      const email = emailInput.value.trim();
  
      if (!email || !email.includes("@")) {
        alert("please enter a valid email");
        return;
      }
  
      try {
        await addDoc(collection(db, "mailing-list"), {
          email,
          timestamp: serverTimestamp()
        });
        alert("thanks for signing up!");
        emailInput.value = ""; // clear form
      } catch (error) {
        console.error("error saving email:", error);
        alert("something went wrong, try again");
      }
    });

  document.getElementById("code-access").addEventListener("submit", async (e) => {
      e.preventDefault();

      const codeInput = document.getElementById("code-input");
      const code = codeInput.value.trim();

      if (!code) {
          alert("please enter a code");
          return;
      }

      try {
          const codesRef = collection(db, "access-codes");
          const q = query(codesRef, where("code", "==", code));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
              alert("incorrect code");
              return;
          }

          const codeDoc = querySnapshot.docs[0];
          const codeDocRef = doc(db, "access-codes", codeDoc.id);

          await runTransaction(db, async (tx) => {
              const snap = await tx.get(codeDocRef);
              const current = Number(snap.get("usedCount")) || 0;
              tx.update(codeDocRef, { usedCount: current + 1 });
          });

          window.location.href = "../todo-list/todo-list.html";
      } catch (error) {
          console.error("error validating code: ", error);
          alert("something went wrong, please try again");
      }
  });