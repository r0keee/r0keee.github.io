import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, set, get, remove } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js"

const firebaseConfig = {
  apiKey: "AIzaSyDTjOXJsl7r431cw0PajJkhPvV0Qt9cKEo",
  authDomain: "throwaway-47e8c.firebaseapp.com",
  databaseURL: "https://throwaway-47e8c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "throwaway-47e8c",
  storageBucket: "throwaway-47e8c.firebasestorage.app",
  messagingSenderId: "108913093651",
  appId: "1:108913093651:web:66b9d2370bd7946d93a3e6"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function generateId(length = 8) {
  return Math.random().toString(36).substr(2, length);
}

document.getElementById('generate').addEventListener('click', async () => {
  const note = document.getElementById('note').value;
  if (!note) return alert('Enter the text of the note!');

  const id = generateId();
  await set(ref(db, `notes/${id}`), { text: note });

  const link = `${window.location.origin}${window.location.pathname}?id=${id}`;
  document.getElementById('link-container').innerHTML = `Link: <a href="${link}" target="_blank">${link}</a>`;
  document.getElementById('note').value = '';
});

(async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  if (id) {
    const noteRef = ref(db, `notes/${id}`);
    const snapshot = await get(noteRef);

    if (snapshot.exists()) {
      const note = snapshot.val().text;

      document.getElementById('create-note').style.display = 'none';
      document.getElementById('view-note').style.display = 'block';
      document.getElementById('note-content').textContent = note;

      await remove(noteRef);
    } else {
      alert('The note has already been deleted or does not exist.');
      window.location.href = window.location.pathname; // Перезагрузка без параметров
    }
  }
})();