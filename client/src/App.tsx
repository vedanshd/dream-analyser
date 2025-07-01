// Simple debug version
function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#6D5A9E' }}>DreamScape - AI Dream Analyzer</h1>
      <p>Environment: {import.meta.env.PROD ? 'Production' : 'Development'}</p>
      <p>Hostname: {window.location.hostname}</p>
      <p>Base Path: {import.meta.env.PROD && window.location.hostname.includes("github.io") ? "/dream-analyser" : "(none)"}</p>
      <p>Full URL: {window.location.href}</p>
      <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0' }}>
        <p><strong>Debug Info:</strong></p>
        <p>If you can see this text, the React app is loading correctly!</p>
        <p>The issue was with the routing configuration.</p>
      </div>
    </div>
  );
}

export default App;
