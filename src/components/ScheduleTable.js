import React, {  useState } from "react";

function ScheduleTable({
    title,
    schedule,
    days,
    times,
    addActivity,
    resetSchedule,
    isMilo,
  }) {
    const [day, setDay] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [activity, setActivity] = useState(isMilo ? "מיכל" : "");
  
    // פונקציה למציאת פעילות ביום ושעה/זמן ספציפיים
    const getActivityForTime = (day, time) => {
      const foundActivity = schedule.find(
        (item) =>
          item.day === day &&
          (item.time === time || (item.startTime <= time && item.endTime >= time))
      );
      return foundActivity ? foundActivity.activity : "";
    };
  
    const handleAddActivity = () => {
      if (isMilo) {
        addActivity(day, startTime, activity);
      } else {
        addActivity(day, startTime, endTime, activity);
      }
      setDay("");
      setStartTime("");
      setEndTime("");
      setActivity(isMilo ? "מיכל" : "");
    };
  
    // פונקציה לבחירת צבע לפי סוג הפעילות
    const getActivityColor = (activity) => {
      if (isMilo) return ""; // ביטול צבעים עבור מיילו
      switch (activity) {
        case "עבודה":
          return "lightgreen";
        case "לימודים":
          return "lightgray";
        case "מלגת פרח":
          return "pink";
        case "מלג שוות":
          return "orange";
        default:
          return "lightcoral";
      }
    };
  
    return (
      <div className="table-container">
        <h2>{title}</h2>
        <table className="weekly-schedule">
          <thead>
            <tr>
              <th>{isMilo ? "זמן" : "שעות"}</th>
              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map((time, timeIndex) => (
              <tr key={time}>
                <td>{time}</td>
                {days.map((day) => {
                  const activity = getActivityForTime(day, time);
                  const foundActivity = schedule.find(
                    (item) =>
                      item.day === day &&
                      (item.time === time || item.startTime === time)
                  );
                  if (
                    foundActivity &&
                    (foundActivity.time === time ||
                      foundActivity.startTime === time)
                  ) {
                    const startIdx = timeIndex;
                    const endIdx = times.findIndex(
                      (t) => t === foundActivity.endTime
                    );
                    const rowSpan = endIdx - startIdx + 1;
                    return (
                      <td
                        key={day}
                        rowSpan={rowSpan}
                        className={activity ? "highlighted-cell" : ""}
                        style={
                          activity
                            ? { backgroundColor: getActivityColor(activity) }
                            : {}
                        }
                      >
                        {activity}
                      </td>
                    );
                  } else if (activity) {
                    return null;
                  }
                  return <td key={day}></td>;
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
            {days.map((dayOption) => (
              <option key={dayOption} value={dayOption}>
                {dayOption}
              </option>
            ))}
          </select>
  
          {isMilo ? (
            <>
              <label>בחר זמן:</label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              >
                <option value="">בחר זמן</option>
                {times.map((timeOption) => (
                  <option key={timeOption} value={timeOption}>
                    {timeOption}
                  </option>
                ))}
              </select>
  
              <label>בחר שם:</label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
              >
                <option value="מיכל">מיכל</option>
                <option value="תמר">תמר</option>
                <option value="ליזי">ליזי</option>
                <option value="אורן">אורן</option>
              </select>
            </>
          ) : (
            <>
              <label>בחר שעת התחלה:</label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              >
                <option value="">בחר שעת התחלה</option>
                {times.map((timeOption) => (
                  <option key={timeOption} value={timeOption}>
                    {timeOption}
                  </option>
                ))}
              </select>
  
              <label>בחר שעת סיום:</label>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              >
                <option value="">בחר שעת סיום</option>
                {times.map((timeOption) => (
                  <option key={timeOption} value={timeOption}>
                    {timeOption}
                  </option>
                ))}
              </select>
  
              <label>פעילות:</label>
              <input
                type="text"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
              />
            </>
          )}
  
          <button onClick={handleAddActivity}>הוסף פעילות</button>
        </div>
  
        {/* כפתור איפוס לוח הזמנים */}
        <button className="reset-button" onClick={resetSchedule}>
          איפוס לוח זמנים
        </button>
      </div>
    );
  }

  export default ScheduleTable