import React from 'react'
import { Button, Col, Row } from 'react-bootstrap'

const Body = () => {
  return (
    <div>
      <div className='fade-in container-fluid d-flex justify-content-start align-items-center' style={{height: '100vh'}}> {/*height: 'calc(100vh - 75px)'*/}
        <div className='ms-5 d-flex flex-column justify-content-start align-items-start' style={{width:600}}>
          <h3 className=''>Transforming Ideas into Digital Excellence</h3>
          <p className='text-start'>Empowering businesses with innovative software solutions for growth and efficiency. We specialize in creating tailored digital experiences. Your trusted partner in technology and transformation.</p>
          <Button className='bg-light link-secondary border-secondary px-4 fw-normal'>Contact Us</Button>
        </div>
      </div>
      <div className='products'>
        <div className='container-fluid d-flex justify-content-start align-items-center' style={{width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.6)'}}>
        <div className='ms-5 d-flex flex-column justify-content-start align-items-start' style={{width:600}}>
          <h3 className=''>We Provide Innovative IT Solutions</h3>
          <p className='text-start'>Our products provide innovative software solutions that drive efficiency, streamline processes, and boost productivity for businesses across industries. We specialize in custom software development, cloud solutions, and enterprise resource management tools. Each product is tailored to meet your unique needs, ensuring scalability, security, and long-term growth. Let us empower your business with the latest in software technology.</p>
          <Button className='bg-warning text-light border-warning px-4 fw-normal'>Check Out Products</Button>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Body