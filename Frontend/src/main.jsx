import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './Utils/rem.js'
import './Styles/Global.css'

createRoot(document.getElementById('root')).render(
    <App />
)