import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import './header.css'


function Header() {
  return (
    
    <header className='container'>
      
      <div className='navbar'>
        <div className='logo'>
          
        </div>

        <div className='Location'>
          <i className="fa-solid fa-location-dot"></i>
          <span>Delhi</span>
          <span>{}</span>
        </div>

        <div className='RoutingLinks'>
          <ul>
            <li>
              <NavLink to ='/' className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
            </li>
            <li>
              <NavLink to ='/support' className={({ isActive }) => isActive ? 'active' : ''}>Support</NavLink>
            </li>
            <li>
              {/* <NavLink to ='/login' className={({ isActive }) => isActive ? 'active' : ''}>Login</NavLink>
            </li>
            <li>
              <NavLink to ='/signup' className={({ isActive }) => isActive ? 'active' : ''}>Signup</NavLink> */}
            </li>
          </ul>
        </div>

      </div>

       
    </header>
  )}
export default Header
