import React, { useEffect, useState } from "react";
import cong from "./configuration"; // Assuming the correct path to your configuration file
import { getDatabase, ref, onValue } from "firebase/database";
import './style.css';
function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Initialize the Firebase database with the provided configuration
    const database = getDatabase(cong);
    
    // Reference to the specific collection in the database
    const collectionRef = ref(database, "your_collection");

    // Function to fetch data from the database
    const fetchData = () => {
      // Listen for changes in the collection
      onValue(collectionRef, (snapshot) => {
        const dataItem = snapshot.val();

        // Check if dataItem exists
        if (dataItem) {
          // Convert the object values into an array
          const displayItem = Object.values(dataItem);
          setData(displayItem);
        }
      });
    };

    // Fetch data when the component mounts
    fetchData();
  }, []);

  return (
    <div>
      <h1>Data from database:</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
function ScheduleManager() {
  // סטייט עבור כניסה למערכת
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // סטייט עבור לוחות זמנים של מיכל, תמר ומיילו
  const [michalSchedule, setMichalSchedule] = useState([]);
  const [tamarSchedule, setTamarSchedule] = useState([]);
  const [miloSchedule, setMiloSchedule] = useState([]);

  const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  const times = [
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
    '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
  ];
  const miloTimes = ['בוקר', 'צהריים', 'ערב', 'לילה'];

  // פונקציות להוספת פעילות חדשה
  const addActivity = (scheduleSetter, day, startTime, endTime, activity) => {
    scheduleSetter(prevSchedule => [
      ...prevSchedule,
      { day, startTime, endTime, activity },
    ]);
  };

  const addMiloActivity = (day, time, activity) => {
    setMiloSchedule(prevSchedule => [
      ...prevSchedule,
      { day, time, activity },
    ]);
  };

  // פונקציות לאיפוס לוחות הזמנים
  const resetMichalSchedule = () => setMichalSchedule([]);
  const resetTamarSchedule = () => setTamarSchedule([]);
  const resetMiloSchedule = () => setMiloSchedule([]);

  // פונקציה לטיפול בכניסה למערכת
  const handleLogin = () => {
    if (username === 'cohen' && password === '123456') {
      setIsAuthenticated(true);
    } else {
      alert('שם משתמש או סיסמה שגויים');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="login-form">
        <h2>כניסה למערכת</h2>
        <label>שם משתמש:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>סיסמה:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>התחבר</button>
      </div>
    );
  }

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
            addActivity={(day, startTime, endTime, activity) =>
              addActivity(setMichalSchedule, day, startTime, endTime, activity)
            }
            resetSchedule={resetMichalSchedule}
          />

          {/* לוח שבועי של תמר */}
          <ScheduleTable
            title="לוח שבועי של תמר"
            schedule={tamarSchedule}
            days={days}
            times={times}
            addActivity={(day, startTime, endTime, activity) =>
              addActivity(setTamarSchedule, day, startTime, endTime, activity)
            }
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

function ScheduleTable({ title, schedule, days, times, addActivity, resetSchedule, isMilo }) {
  const [day, setDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [activity, setActivity] = useState(isMilo ? 'מיכל' : '');

  // פונקציה למציאת פעילות ביום ושעה/זמן ספציפיים
  const getActivityForTime = (day, time) => {
    const foundActivity = schedule.find(
      item => item.day === day && (item.time === time || (item.startTime <= time && item.endTime >= time))
    );
    return foundActivity ? foundActivity.activity : '';
  };

  const handleAddActivity = () => {
    if (isMilo) {
      addActivity(day, startTime, activity);
    } else {
      addActivity(day, startTime, endTime, activity);
    }
    setDay('');
    setStartTime('');
    setEndTime('');
    setActivity(isMilo ? 'מיכל' : '');
  };

  // פונקציה לבחירת צבע לפי סוג הפעילות
  const getActivityColor = (activity) => {
    if (isMilo) return ''; // ביטול צבעים עבור מיילו
    switch (activity) {
      case 'עבודה':
        return 'lightgreen';
      case 'לימודים':
        return 'lightgray';
      case 'מלגת פרח':
        return 'pink';
      case 'מלג שוות':
        return 'orange';
      default:
        return 'lightcoral';
    }
  };

  return (
    <div className="table-container">
      <h2>{title}</h2>
      <table className="weekly-schedule">
        <thead>
          <tr>
            <th>{isMilo ? 'זמן' : 'שעות'}</th>
            {days.map(day => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map((time, timeIndex) => (
            <tr key={time}>
              <td>{time}</td>
              {days.map(day => {
                const activity = getActivityForTime(day, time);
                const foundActivity = schedule.find(
                  item => item.day === day && (item.time === time || item.startTime === time)
                );
                if (foundActivity && (foundActivity.time === time || foundActivity.startTime === time)) {
                  const startIdx = timeIndex;
                  const endIdx = times.findIndex(t => t === foundActivity.endTime);
                  const rowSpan = endIdx - startIdx + 1;
                  return (
                    <td
                      key={day}
                      rowSpan={rowSpan}
                      className={activity ? 'highlighted-cell' : ''}
                      style={activity ? { backgroundColor: getActivityColor(activity) } : {}}
                    >
                      {activity}
                    </td>
                  );
                } else if (activity) {
                  return null;
                }
                return (
                  <td key={day}></td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* טופס להוספת פעילות */}
      <div className="add-time-form">
        <h3>הוספת פעילות</h3>
        <label>בחר יום:</label>
        <select value={day} onChange={(e) => setDay(e.target.value)}>
          <option value="">בחר יום</option>
          {days.map(dayOption => (
            <option key={dayOption} value={dayOption}>{dayOption}</option>
          ))}
        </select>

        {isMilo ? (
          <>
            <label>בחר זמן:</label>
            <select value={startTime} onChange={(e) => setStartTime(e.target.value)}>
              <option value="">בחר זמן</option>
              {times.map(timeOption => (
                <option key={timeOption} value={timeOption}>{timeOption}</option>
              ))}
            </select>

            <label>בחר שם:</label>
            <select value={activity} onChange={(e) => setActivity(e.target.value)}>
              <option value="מיכל">מיכל</option>
              <option value="תמר">תמר</option>
              <option value="ליזי">ליזי</option>
              <option value="אורן">אורן</option>
            </select>
          </>
        ) : (
          <>
            <label>בחר שעת התחלה:</label>
            <select value={startTime} onChange={(e) => setStartTime(e.target.value)}>
              <option value="">בחר שעת התחלה</option>
              {times.map(timeOption => (
                <option key={timeOption} value={timeOption}>{timeOption}</option>
              ))}
            </select>

            <label>בחר שעת סיום:</label>
            <select value={endTime} onChange={(e) => setEndTime(e.target.value)}>
              <option value="">בחר שעת סיום</option>
              {times.map(timeOption => (
                <option key={timeOption} value={timeOption}>{timeOption}</option>
              ))}
            </select>

            <label>פעילות:</label>
            <input type="text" value={activity} onChange={(e) => setActivity(e.target.value)} />
          </>
        )}

        <button onClick={handleAddActivity}>הוסף פעילות</button>
      </div>

      {/* כפתור איפוס לוח הזמנים */}
      <button className="reset-button" onClick={resetSchedule}>איפוס לוח זמנים</button>
    </div>
  );
}

export default ScheduleManager;
