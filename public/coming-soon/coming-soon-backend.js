    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
    import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc, increment } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
  
    const firebaseConfig = {
      apiKey: "AIzaSyAd1UJrE9LFvNOI6jp9am1eyHQLDL5Ll8Q",
      authDomain: "studyling-6fada.firebaseapp.com",
      projectId: "studyling-6fada",
      storageBucket: "studyling-6fada.appspot.com",
      messagingSenderId: "426130916056",
      appId: "1:426130916056:web:76862156edde2100adcdad"
    };
  
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
  
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
        emailInput.value = ""; 
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

        if (!querySnapshot.empty) {
            const codeDoc = querySnapshot.docs[0];
            const codeDocRef = doc(db, "access-codes", codeDoc.id);
            await updateDoc(codeDocRef, {
                usedCount: increment(1)
            });
            window.location.href = '../todo-list/todo-list.html';
        } else {
            alert("not a valid code");
        }
    } catch (error) {
        console.error("error validating code: ", error);
        alert("something went wrong, please try again");
    }
});