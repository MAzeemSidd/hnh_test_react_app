import React from 'react'
import {Navbar, Nav, Button, Row, Col, Container} from 'react-bootstrap';
import '../App.css'

const Home = () => {
  return (
    <Row className='slide-in-down gx-4'>

        <Col className="col-9">
        <Row className='gx-4'>

            <Col className="col-4 d-flex justify-content-center align-items-center">
                <Container className='logo'>HnH Soft Tech</Container>
            </Col>

            <Col className="col-8">
                <Row className='gx-0 justify-content-center align-items-center' style={{height: '75px'}}>
                    <Col><a href='#' className='button text-decoration-none'>Home</a></Col>
                    <Col><a href='#' className='button text-decoration-none'>Product</a></Col>
                    <Col><a href='#' className='button text-decoration-none'>About</a></Col>
                    <Col><a href='#' className='button text-decoration-none'>Contact</a></Col>
                </Row>
            </Col>

        </Row>
        </Col>

        <Col className='col-3 d-flex justify-content-center align-items-center' style={{height: '75px'}}>
            <button className='border-0 button' style={{backgroundColor: 'transparent', borderColor: '#ccc'}}>Login</button>
            <text className='text-secondary'>/</text>
            <button className='border-0 button' style={{backgroundColor: 'transparent', borderColor: '#ccc'}}>SignUp</button>
        </Col>
    </Row>
  )
}

export default Home