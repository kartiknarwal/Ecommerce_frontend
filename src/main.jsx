import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './components/theme-Provider'
import { UserProvider } from './context/UserContext'
import { ProductProvider } from './context/ProductContext'
import { CartProvider } from './context/CartContext'

export const server = "https://ecommerce-server-qmyh.onrender.com";

export const categories =[
  "Young",
  "big tits",
  "mylf",
  "silicone tits",
  "asian",
  "latina",
  "ebony",
  "perfect body",
  "indian",
  "desi",
  "korena",
  "russian"
]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <UserProvider>
        <ProductProvider>
          <CartProvider>
            <App />
         </CartProvider>
         </ProductProvider>
         </UserProvider>
     </ThemeProvider>
  </StrictMode>,
)
