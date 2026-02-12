import React from 'react'
import './footer.css'

function Footer() {
  return (
    <div className='Footer'>
      <div className='footerContent'>
        <div className='footerSection1'>
          <h3>Contact Us</h3>
          <p>Email:contact@pharmacy.com</p>
          <p>Phone:+91 1234567890</p>
          <p>Address:123 Main Street, Delhi, India</p>



        </div>
        <div className='footerSection2'>
          <h3>Quick Links</h3>
          <ul>
            <li>Home</li>
            <li>Support</li>
            <li>Login</li>
            <li>Signup</li>
          </ul>
        </div>
        <div className='footerSection3'>
          <h3>Follow Us</h3>
          <div className='socialIcons'>
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
          </div>
        </div>

        
        </div>      
    </div>
  )
}

export default Footer
