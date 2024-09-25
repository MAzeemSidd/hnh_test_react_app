import React from 'react'
import { Button, Col, Row } from 'react-bootstrap'

const Body = () => {
  return (
    <div className='fade-in container-fluid d-flex justify-content-start align-items-center' style={{height: 'calc(100vh - 30px)'}}>
      <div className='ms-5 d-flex flex-column justify-content-start align-items-start' style={{width:600}}>
        <h3 className=''>Transforming Ideas into Digital Excellence</h3>
        <p className='text-start'>Empowering businesses with innovative software solutions for growth and efficiency. We specialize in creating tailored digital experiences. Your trusted partner in technology and transformation.</p>
        <Button className='bg-light link-secondary border-secondary px-4 fw-normal'>Contact Us</Button>
      </div>
    </div>
  )
}

export default Body