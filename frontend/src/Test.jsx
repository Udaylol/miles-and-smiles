import { useState } from "react";
import ApiButton from "./ApiButton";

function Test() {
  const [me, setMe] = useState(null);
  const [signupResponse, setSignupResponse] = useState(null);
  const [getMeResponse, setGetMeResponse] = useState(null);
  const [signupError, setSignupError] = useState(null);

  // form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", color: "white" }}>
      <h2>Signup / Login Form</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "8px", marginRight: "10px", width: "200px" }}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "8px", width: "200px" }}
        />
      </div>

      <ApiButton
        url="http://localhost:3000/api/auth/signup"
        label="Signup"
        body={{ email, password }}
        onSuccess={(data) => setSignupResponse(data)}
        onError={(err) => setSignupError(err)}
      />

      <ApiButton
        url="http://localhost:3000/api/user/me"
        method="GET"
        label="Get Me"
        onSuccess={(data) => {
          setGetMeResponse(data);
          setMe(data);
        }}
        onError={(err) => setSignupError(err)}
      />

      <h3 style={{ marginTop: "30px" }}>Signup Response:</h3>
      <pre style={{ background: "#1a550cff", padding: "10px" }}>
        {signupResponse ? JSON.stringify(signupResponse, null, 2) : "None yet"}
      </pre>

      <h3>Signup Error:</h3>
      <pre style={{ background: "#400", padding: "10px" }}>
        {signupError ? JSON.stringify(signupError, null, 2) : "No error"}
      </pre>

      <h3>Get Me Response:</h3>
      <pre style={{ background: "#222", padding: "10px" }}>
        {getMeResponse ? JSON.stringify(getMeResponse, null, 2) : "None yet"}
      </pre>

      <h3>Your Profile Picture:</h3>
      <div style={{ background: "#222", padding: "10px" }}>
        {me && me.profilePicture ? (
          <>
            <p>URL: {me.profilePicture}</p>
            <img
              src={me.profilePicture}
              alt="Profile"
              style={{ maxWidth: "200px", borderRadius: "50%" }}
            />
          </>
        ) : (
          "No profile picture"
        )}
      </div>
    </div>
  );
}

export default Test;
