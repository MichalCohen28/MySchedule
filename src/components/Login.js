import React, {  useState } from "react";

function Login({ handleLogin }) {
  // סטייט עבור כניסה למערכת
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // פונקציה לטיפול בכניסה למערכת
  const onClick = () => {
    if (username === "cohen" && password === "123456") {
        handleLogin();
    } else {
      alert("שם משתמש או סיסמה שגויים");
    }
  };

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
      <button onClick={onClick}>התחבר</button>
    </div>
  );
}
export default Login;
