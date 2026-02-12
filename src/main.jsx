import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Layout from './Layout.jsx'
import Home from './component/Home/Home.jsx'
import Support from './component/Support/Support.jsx'
import Login from './component/Login&signup/Login.jsx'
import Signup from './component/Login&signup/Signup.jsx'



const Router=createBrowserRouter([
  {
    path:'/',
    element:<Layout/>,
    children:[
      {
        path:"",
        element:<Home/>
      },
      {
        path:"support",
        element:<Support/>
      },
      {
        path:"login",
        element:<Login/>
      },
      { 
        path:"signup",
        element:<Signup/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <RouterProvider router={Router}/>
  </StrictMode>,
)
