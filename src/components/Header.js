import { useState, useContext, useEffect } from 'react'
import {Navbar, Nav, Button, Row, Col, Container} from 'react-bootstrap';
import '../App.css'
import { AuthContext } from '../context/LoginContext';

const Header = ({handleShow, handleLoginModalOpen}) => {
    const auth = useContext(AuthContext)

    const [bgColor, setBgColor] = useState("transparent");

    useEffect(() => {
        const handleScroll = () => {
            // Change background color after scrolling down 100px
            if (window.scrollY > 100) {
                setBgColor("#b5c8d5");
            } else {
                setBgColor("transparent");
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const onLoggingOut = () => {
        auth.logoutUser()
    }

  return (
    <Row className='header slide-in-down gx-4' style={{backgroundColor: bgColor, transition: 'background-color 0.2s ease'}}>

        <Col className="col-9">
        <Row className='gx-4'>

            <Col className="col-4 d-flex justify-content-center align-items-center">
                <Container className='logo'>HnH Soft Tech</Container>
            </Col>

            <Col className="col-8">
                <Row className='gx-0 justify-content-center align-items-center' style={{height: '75px'}}>
                    <Col><a href='#' className='button text-decoration-none'>Home</a></Col>
                    <Col><a href='#' className='button text-decoration-none'>Products</a></Col>
                    <Col><a href='#' className='button text-decoration-none'>About</a></Col>
                    <Col><a href='#' className='button text-decoration-none'>Contact</a></Col>
                </Row>
            </Col>

        </Row>
        </Col>

        <Col className='col-3 d-flex justify-content-center align-items-center' style={{height: '75px'}}>
            {
                auth.userData?.token ?
                <>
                    <div className='d-flex align-items-center me-3'>
                        <img
                            src="https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
                            alt="Avatar"
                            className="avatar me-2"
                        />
                        <text className='d-inline-block text-truncate text-secondary' style={{width: 150}}>
                            {auth?.userData?.firstname + ' ' + auth?.userData?.lastname}
                        </text>
                    </div>
                    <text className='text-secondary'>|</text>
                    <Button onClick={onLoggingOut} variant="outline-light" className='text-secondary border-0 ms-2'>Logout</Button>
                </>
                :
                <>
                    <button onClick={handleLoginModalOpen} className='border-0 button' style={{backgroundColor: 'transparent', borderColor: '#ccc'}}>Login</button>
                    <text className='text-secondary'>/</text>
                    <button onClick={handleShow} className='border-0 button' style={{backgroundColor: 'transparent', borderColor: '#ccc'}}>SignUp</button>
                </>
            }
        </Col>
    </Row>
  )
}

export default Header