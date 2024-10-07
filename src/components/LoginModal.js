import axios from 'axios';
import { Field, Formik, Form as FormikForm } from 'formik'
import React, { useContext, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import * as Yup from 'yup';
import { AuthContext } from '../context/LoginContext';

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Enter email'),
  password: Yup.string()
  .min(8, 'Minimum 8 characters long')
  .required('Enter password'),
});

const LoginModal = ({showLoginModal, handleLoginModalClose}) => {
  const auth = useContext(AuthContext)

  return (<>
    <Modal show={showLoginModal} onHide={handleLoginModalClose}>
      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        validationSchema={loginSchema}
        onSubmit={async (values) => {
          try {
            const response = await axios.post('http://localhost:9000/users/login', values)
            if(response?.status === 200){
              auth.loginUser(response?.data)
              console.log(response?.data)
              handleLoginModalClose();
            }
          } catch (error) {
            console.log('error', error)
          }
        }}
      >
        {({ errors, touched }) => (
          <FormikForm>
            <Modal.Header closeButton>
              <Modal.Title>Login</Modal.Title>
            </Modal.Header>

            <Modal.Body>

              <div class="form-group my-3">
                <label for="email">Email address</label>
                <Field name="email" type='email' id='email' className='form-control' placeholder='email@example.com' />
                {errors.email && touched.email ? <div className='text-danger'>{errors.email}</div> : null}
              </div>

              <div class="form-group my-3">
                <label for="password">Password</label>
                <Field name="password" type='password' id='password' className='form-control' placeholder='Provide a strong password' />
                {errors.password && touched.password ? <div className='text-danger'>{errors.password}</div> : null}
              </div>

            </Modal.Body>

            <Modal.Footer>
              <Button variant="light" onClick={handleLoginModalClose}>
                Close
              </Button>
              <Button variant="primary" type='submit'>
                Login
              </Button>
            </Modal.Footer>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  </>)
}

export default LoginModal