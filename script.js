// JavaScript code to add functionality to the weekly schedule tables
const addActivityMichalButton = document.getElementById('add-michal-activity');
const resetMichalTableButton = document.getElementById('reset-michal-table');
const addActivityTamarButton = document.getElementById('add-tamar-activity');
const resetTamarTableButton = document.getElementById('reset-tamar-table');
const addActivityMiloButton = document.getElementById('add-milo-activity');
const resetMiloTableButton = document.getElementById('reset-milo-table');

import { collection, doc, setDoc, getDocs } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';

// Firestore Helper Functions
const saveTableData = async (collectionName, data) => {
    const colRef = collection(window.db, collectionName);
    const docRef = doc(colRef);
    await setDoc(docRef, data);
};

const getTableData = async (collectionName) => {
  try {
      const colRef = collection(window.db, collectionName);
      const snapshot = await getDocs(colRef);
      return snapshot.docs.map(doc => doc.data()) || []; // Ensure it's an array
  } catch (error) {
      console.error('Error fetching table data:', error);
      return []; // Return an empty array if there's an error
  }
};


// Function to add activity to the table and merge cells
const addActivityToTable = (scheduleClass, dayIndex, startTime, endTime, activity) => {
  const table = document.querySelector(`.${scheduleClass}`);
  const rows = table.rows;
  let startAdding = false;
  let startRow = null;

  for (let i = 1; i < rows.length; i++) {
      const time = rows[i].cells[0].textContent;
      if (time === startTime) {
          startAdding = true;
          startRow = rows[i];
          startRow.cells[dayIndex].textContent = activity;
          startRow.cells[dayIndex].style.backgroundColor = getColorByActivity(activity);
          startRow.cells[dayIndex].rowSpan = 1;
      } else if (startAdding) {
          rows[i].cells[dayIndex].remove();
          startRow.cells[dayIndex].rowSpan++;
      }
      if (time === endTime) {
          break;
      }
  }
};

// שאר הקוד שלך...


// Function to determine color by activity
const getColorByActivity = (activity) => {
  switch (activity) {
    case 'עבודה':
      return 'green';
    case 'לימודים':
      return 'gray';
    case 'מלגת פרח':
      return 'purple';
    case 'מלגת שוות':
      return 'orange';
    default:
      return 'white';
  }
};

// Add activity for Michal
addActivityMichalButton.addEventListener('click', async () => {
  const day = document.getElementById('day-michal').value;
  const startTime = document.getElementById('startTime-michal').value;
  const endTime = document.getElementById('endTime-michal').value;
  const activity = document.getElementById('activity-michal').value;

  addActivityToTable('michal-schedule', day, startTime, endTime, activity);

  let michalData = await getTableData('michalData');
  if (!Array.isArray(michalData)) {
      michalData = [];
  }

  michalData.push({ day, startTime, endTime, activity });
  await saveTableData('michalData', { day, startTime, endTime, activity });
});

// Add activity for Tamar
addActivityTamarButton.addEventListener('click', async () => {
    const day = document.getElementById('day-tamar').value;
    const startTime = document.getElementById('startTime-tamar').value;
    const endTime = document.getElementById('endTime-tamar').value;
    const activity = document.getElementById('activity-tamar').value;

    addActivityToTable('tamar-schedule', day, startTime, endTime, activity);

    let tamarData = await getTableData('tamarData');
    if (!Array.isArray(tamarData)) {
        tamarData = [];
    }

    tamarData.push({ day, startTime, endTime, activity });
    await saveTableData('tamarData', { day, startTime, endTime, activity });
});


// Add activity for Milo
addActivityMiloButton.addEventListener('click', () => {
  const day = document.getElementById('day-milo').value;
  const time = document.getElementById('time-milo').value;
  const person = document.getElementById('person-milo').value;

  const table = document.querySelector('.milo-schedule');
  table.rows[parseInt(time) + 1].cells[parseInt(day) + 1].textContent = person;

  const miloData = getTableData('miloData');
  miloData.push({ day, time, person });
  saveTableData('miloData', miloData);
});

// Reset table for Michal
resetMichalTableButton.addEventListener('click', () => {
  const table = document.querySelector('.michal-schedule');
  for (let i = 1; i < table.rows.length; i++) {
    for (let j = 1; j < table.rows[i].cells.length; j++) {
      const cell = table.rows[i].cells[j];
      if (cell && cell.rowSpan > 1) {
        const rowSpan = cell.rowSpan;
        cell.rowSpan = 1;
        for (let k = 1; k < rowSpan; k++) {
          const newRow = table.rows[i + k];
          const newCell = newRow.insertCell(j);
          newCell.style.border = cell.style.border;
        }
      }
      if (cell) {
        cell.textContent = '';
        cell.style.backgroundColor = '';
      }
    }
  }
  localStorage.removeItem('michalData');
});

// Reset table for Tamar
resetTamarTableButton.addEventListener('click', () => {
  const table = document.querySelector('.tamar-schedule');
  for (let i = 1; i < table.rows.length; i++) {
    for (let j = 1; j < table.rows[i].cells.length; j++) {
      const cell = table.rows[i].cells[j];
      if (cell && cell.rowSpan > 1) {
        const rowSpan = cell.rowSpan;
        cell.rowSpan = 1;
        for (let k = 1; k < rowSpan; k++) {
          const newRow = table.rows[i + k];
          const newCell = newRow.insertCell(j);
          newCell.style.border = cell.style.border;
        }
      }
      if (cell) {
        cell.textContent = '';
        cell.style.backgroundColor = '';
      }
    }
  }
  localStorage.removeItem('tamarData');
});

// Reset table for Milo
resetMiloTableButton.addEventListener('click', () => {
  const table = document.querySelector('.milo-schedule');
  for (let i = 1; i < table.rows.length; i++) {
    for (let j = 1; j < table.rows[i].cells.length; j++) {
      const cell = table.rows[i].cells[j];
      if (cell) {
        cell.textContent = '';
      }
    }
  }
  localStorage.removeItem('miloData');
});

// Load data from Firestore on page load
window.addEventListener('load', async () => {
  const michalData = await getTableData('michalData');
  michalData.forEach(({ day, startTime, endTime, activity }) => {
      addActivityToTable('michal-schedule', day, startTime, endTime, activity);
  });

  const tamarData = await getTableData('tamarData');
  tamarData.forEach(({ day, startTime, endTime, activity }) => {
      addActivityToTable('tamar-schedule', day, startTime, endTime, activity);
  });

  const miloData = await getTableData('miloData');
  miloData.forEach(({ day, time, person }) => {
      const table = document.querySelector('.milo-schedule');
      table.rows[parseInt(time) + 1].cells[parseInt(day) + 1].textContent = person;
  });
});
