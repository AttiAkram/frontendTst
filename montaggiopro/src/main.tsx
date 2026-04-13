import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"

const style = document.createElement("style")
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #F2F2F2;
    font-family: 'Montserrat', sans-serif;
    color: #0F0F0F;
    -webkit-font-smoothing: antialiased;
  }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #CCC; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #AAA; }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  button { font-family: 'Montserrat', sans-serif; }
  input, textarea { font-family: 'Montserrat', sans-serif; }
`
document.head.appendChild(style)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
