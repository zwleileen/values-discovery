import React, { useState } from "react";

function App() {
  const [input, setInput] = useState({
    name: "",
    values: "",
  });
  const [response, setResponse] = useState("");

  // 🔹 Handle changes in the name and values fields
  const handleInputChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value, // ✅ Updates the correct field dynamically
    });
  };

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
  <h1>Aligning values with work</h1>
    
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <label htmlFor="name"><strong>Name: </strong></label>
      <input type="text" name="name" id="name" value={input.name} onChange={handleInputChange}/>
    </div>
    
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <label htmlFor="values"><strong>Rank values: </strong></label>
      <textarea name="values" value={input.values} placeholder="Rank your values here..." onChange={handleInputChange} rows={10} />
    </div>
    
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <button onClick={handleSubmit} style={{ marginTop: "10px" }}>
        Send
      </button>
    </div>

    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      {response && (
        <>
          {typeof response === "string" ? ( // ✅ If response is just a string, display only that
            <p>{response}</p>
          ) : (
            <>
              <h2>Summary</h2>
              <p>{response.summary}</p>

              {/* ✅ Only render the sections if they exist and have content */}
              {response.career_themes && response.career_themes.length > 0 && (
                <>
                  <h2>Key Career Themes</h2>
                  <ul>
                    {response.career_themes.map((theme) => (
                      <li key={theme}>{theme}</li>
                    ))}
                  </ul>
                </>
              )}

              {response.work_environments && response.work_environments.length > 0 && (
                <>
                  <h2>Ideal Work Environments</h2>
                  <ul>
                    {response.work_environments.map((env) => (
                      <li key={env}>{env}</li>
                    ))}
                  </ul>
                </>
              )}

              {response.ideal_jobs && response.ideal_jobs.length > 0 && (
                <>
                  <h2>Ideal Job Roles</h2>
                  <ul>
                    {response.ideal_jobs.map((job) => (
                      <li key={job}>{job}</li>
                    ))}
                  </ul>
                </>
              )}

              {response.challenges && response.challenges.length > 0 && (
                <>
                  <h2>Challenges & Solutions</h2>
                  {response.challenges.map((c, index) => (
                    <div key={index}>
                      <strong>Challenge:</strong> {c.challenge} <br />
                      <strong>Solution:</strong> {c.solution}
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  </>
);
}

export default App;
