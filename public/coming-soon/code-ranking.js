import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

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

const rankingsTableBody = document.querySelector("#rankings-table tbody");

async function fetchAndDisplayRankings() {
  try {
    const codesRef = collection(db, "access-codes");
    const querySnapshot = await getDocs(codesRef);

    const items = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const used = typeof data.usedCount === "number" ? data.usedCount : Number(data.usedCount) || 0;
      const name = data.name ?? data.code ?? "(unnamed)";
      items.push({ name, usedCount: used });
    });

    items.sort((a, b) => b.usedCount - a.usedCount);

    rankingsTableBody.innerHTML = "";
    items.forEach((item, index) => {
      const row = document.createElement("tr");

      const rankCell = document.createElement("td");
      rankCell.textContent = String(index + 1);
      row.appendChild(rankCell);

      const nameCell = document.createElement("td");
      nameCell.textContent = item.name;
      row.appendChild(nameCell);

      const usedCountCell = document.createElement("td");
      usedCountCell.textContent = String(item.usedCount);
      row.appendChild(usedCountCell);

      rankingsTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("error fetching rankings: ", error);
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 3;
    cell.textContent = "could not load rankings.";
    row.appendChild(cell);
    rankingsTableBody.appendChild(row);
  }
}

fetchAndDisplayRankings();
