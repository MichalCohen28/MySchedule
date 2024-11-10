import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import  ScheduleTable from "./components/ScheduleTable";

import { addDoc, getDocs, collection } from "firebase/firestore";

import "./style.css";
import Login from "./components/Login";

const MICHAL_COLLECTION = "michal_schedule";
const TAMAR_COLLECTION = "tamar_schedule";
const MILO_COLLECTION = "milo_schedule";

const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
const times = [
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
  "23:30",
];
const miloTimes = ["בוקר", "צהריים", "ערב", "לילה"];

function ScheduleManager() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  const [michalSchedule, setMichalSchedule] = useState([]);
  const [tamarSchedule, setTamarSchedule] = useState([]);
  const [miloSchedule, setMiloSchedule] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const micahlCollectionRef = collection(db, MICHAL_COLLECTION);
      const tamarCollectionRef = collection(db, TAMAR_COLLECTION);
      const miloCollectionRef = collection(db, MILO_COLLECTION);
      const data = await getDocs(micahlCollectionRef);
      
      setMichalSchedule(
        data.docs.map((elem) => ({ ...elem.data() }))
      );
      const data2 = await getDocs(tamarCollectionRef);
      setTamarSchedule(
        data2.docs.map((elem) => ({ ...elem.data(), id: elem.id }))
      );
      const data3 = await getDocs(miloCollectionRef);
      setMiloSchedule(
        data3.docs.map((elem) => ({ ...elem.data(), id: elem.id }))
      );
    };
    fetchData();
  }, []);

  const saveToFirebase = (col, data) => addDoc(collection(db, col), data);

  // פונקציות להוספת פעילות חדשה
  const addActivity = (scheduleSetter, day, startTime, endTime, activity, colName) => {
    const newItem={ day, startTime, endTime, activity }
    saveToFirebase(colName, newItem)
    scheduleSetter((prevSchedule) => [
      ...prevSchedule,
      { ...newItem },
    ]);
  };

  const addMiloActivity = (day, time, activity) => {
    const newItem={ day, time, activity }

    saveToFirebase(MILO_COLLECTION, newItem);
    setMiloSchedule((prevSchedule) => [
      ...prevSchedule,
      { ...newItem },
    ]);
  };

  // פונקציות לאיפוס לוחות הזמנים
  const resetMichalSchedule = () => {
    // saveToFirebase(MICHAL_COLLECTION, []);
    setMichalSchedule([]);
  };
  const resetTamarSchedule = () => {
    // saveToFirebase(TAMAR_COLLECTION, []);
    setTamarSchedule([]);
  };
  const resetMiloSchedule = () => {
    // saveToFirebase(MILO_COLLECTION, []);
    setMiloSchedule([]);
  };

  if (!true)
    return (
      <Login
        isAuthenticated={isAuthenticated}
        handleLogin={()=>setIsAuthenticated(true)}
      />
    );

  return (
    <div className="schedule-manager">
      <header>
        <h1>אפליקציה לניהול לוחות שבועיים</h1>
        <p>ניהול לוחות של מיכל, תמר ומיילו!</p>
      </header>

      <main>
        <div className="tables-row">
          <div className="tables-row-horizontal">
            {/* לוח שבועי של מיכל */}
            <ScheduleTable
              title="לוח שבועי של מיכל"
              schedule={michalSchedule}
              days={days}
              times={times}
              addActivity={(day, startTime, endTime, activity) => {
                addActivity(
                  setMichalSchedule,
                  day,
                  startTime,
                  endTime,
                  activity,
                  MICHAL_COLLECTION
                );
              }}
              resetSchedule={resetMichalSchedule}
            />

            {/* לוח שבועי של תמר */}
            <ScheduleTable
              title="לוח שבועי של תמר"
              schedule={tamarSchedule}
              days={days}
              times={times}
              addActivity={(day, startTime, endTime, activity) => {
                addActivity(
                  setTamarSchedule,
                  day,
                  startTime,
                  endTime,
                  activity,
                  TAMAR_COLLECTION
                );
              }}
              resetSchedule={resetTamarSchedule}
            />
          </div>

          {/* לוח שבועי של מיילו */}
          <ScheduleTable
            title="לוח שבועי של מיילו"
            schedule={miloSchedule}
            days={days}
            times={miloTimes}
            isMilo
            addActivity={addMiloActivity}
            resetSchedule={resetMiloSchedule}
          />
        </div>
      </main>
    </div>
  );
}

export default ScheduleManager;
