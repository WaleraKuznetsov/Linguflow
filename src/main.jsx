import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // <--- ВОТ ЭТА СТРОКА ДОЛЖНА БЫТЬ ОБЯЗАТЕЛЬНО!

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)