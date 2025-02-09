import React, { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:5001/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    setResponse(data.response);
  };

  return (
    <>
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Chat with GPT</h2>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        rows={4}
        style={{ width: "100%" }}
      />
      <button onClick={handleSubmit} style={{ marginTop: "10px" }}>
        Send
      </button>
    </div>
    <div>
    {response && (
      <>
        <h2>Summary</h2>
        <p>{response.summary}</p>

        <h2>Key Career Themes</h2>
        <ul>{response.career_themes.map((theme) => <li key={theme}>{theme}</li>)}</ul>

        <h2>Ideal Work Environments</h2>
        <ul>{response.work_environments.map((env) => <li key={env}>{env}</li>)}</ul>

        <h2>Ideal Job Roles</h2>
        <ul>{response.ideal_jobs.map((job) => <li key={job}>{job}</li>)}</ul>

        <h2>Challenges & Solutions</h2>
        {response.challenges.map((c, index) => (
          <div key={index}>
            <strong>Challenge:</strong> {c.challenge} <br />
            <strong>Solution:</strong> {c.solution}
          </div>
        ))}
      </>
    )}
  </div>
  </>
  );
}

export default App;
