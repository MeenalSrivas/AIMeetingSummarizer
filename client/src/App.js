import React, { useState } from "react";
import "./App.css";

function App() {
  const [transcriptText, setTranscriptText] = useState("");
  const [prompt, setPrompt] = useState("");
  const [summary, setSummary] = useState("");
  const [recipients, setRecipients] = useState("");
  const [emailSubject, setEmailSubject] = useState("Meeting Summary");
  const [loading, setLoading] = useState(false);

   
  const handleGenerateSummary = async () => {
    

    if (!transcriptText || !prompt) {
      alert("Please upload a transcript and enter a prompt.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: transcriptText,
          prompt: prompt,
        }),
      });

      const data = await response.json();
      setSummary(data.summary || "");
    } catch (err) {
      console.error(err);
      alert("Failed to generate summary");
    } finally {
      setLoading(false);
    }
  };

  
  const handleSendEmail = async () => {
    if (!recipients || !summary) {
      alert("Please enter recipient emails and ensure a summary exists.");
      return;
    }

    try {
      await fetch("http://localhost:8000/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients,
          subject: emailSubject,
          body: summary,
        }),
      });
      alert("Email sent!");
    } catch (err) {
      console.error(err);
      alert("Failed to send email");
    }
  };

  const handleFileChange = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {

    setTranscriptText(event.target.result);
  };
  reader.readAsText(file);
};


  return (
    <div className="app-wrapper">
      <h1 className="title">AI Meeting Summarizer</h1>

      <div className="container">
        {/* Left Section */}
        <div className="left-panel">
          <div className="form-group">
            <label>Upload transcript (.txt):</label>
            <input type="file" accept=".txt" onChange={handleFileChange} />
          </div>

          <div className="form-group">
            <label>Custom Instruction / Prompt:</label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Summarize in bullet points for executives"
            />
          </div>

          <button className="primary-button" onClick={handleGenerateSummary} disabled={loading}>
            {loading ? "Generating..." : "Generate Summary"}
          </button>

          {summary && (
            <>
              <div className="form-group">
                <label>Recipients (comma-separated):</label>
                <input
                  type="text"
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  placeholder="example1@gmail.com, example2@domain.com"
                />
              </div>

              <div className="form-group">
                <label>Email Subject:</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>

              <button className="primary-button" onClick={handleSendEmail}>
                Send Email
              </button>
            </>
          )}
        </div>

        
        <div className="right-panel">
          {summary && (
            <>
              <label>Editable Summary:</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
