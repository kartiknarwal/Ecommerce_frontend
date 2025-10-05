import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './components/theme-Provider'
import { UserProvider } from './context/UserContext'
import { ProductProvider } from './context/ProductContext'
import { CartProvider } from './context/CartContext'

// export const server = "http://localhost:5000";
export const server ="https://ecommerce-server-1-1k2i.onrender.com"

export const categories =[
  "Suv",
  "Sedan",
  "luxury", 
  "sports",
  "Hatchback",
  "convertible",
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
