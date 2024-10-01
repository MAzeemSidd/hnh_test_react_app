import axios from 'axios';
import { Field, Formik, Form as FormikForm } from 'formik'
import React, { useContext, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import * as Yup from 'yup';
import { AuthContext } from '../context/LoginContext';

const SignupSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  lastname: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
  .min(8, 'Minimum 8 characters long')
  .required('Required'),
});

const SignupModal = ({showSignupModal, handleClose}) => {
  const auth = useContext(AuthContext)

  return (<>
    <Modal show={showSignupModal} onHide={handleClose}>
      <Formik
        initialValues={{
          firstname: '',
          lastname: '',
          email: '',
          password: ''
        }}
        validationSchema={SignupSchema}
        onSubmit={async (values) => {
          console.log(JSON.stringify(values));
          try {
            const response = await axios.post('http://localhost:9000/users/signup', values)
            if(response.status === 200){
              auth.loginUser(response.data)
              // localStorage.setItem('loginStatus', JSON.stringify(true));
              // localStorage.setItem('loginUser', JSON.stringify(response.data));
              handleClose();
            }
          } catch(err) {
            console.log(err)
          }
        }}
      >
        {({ errors, touched }) => (
          <FormikForm>
            <Modal.Header closeButton>
              <Modal.Title>Create Account</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              
              <div class="form-group my-3">
                <label for="firstname">First Name</label>
                <Field name="firstname" id='firstname' className='form-control' placeholder='example: "John"' />
                {errors.firstname && touched.firstname ? <div className='text-danger'>{errors.firstname}</div> : null}
              </div>

              <div class="form-group my-3">
                <label for="lastname">Last Name</label>
                <Field name="lastname" id='lastname' className='form-control' placeholder='example: "Doe"' />
                {errors.lastname && touched.lastname ? <div className='text-danger'>{errors.lastname}</div> : null}
              </div>

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
              <Button variant="light" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" type='submit'>
                signup
              </Button>
            </Modal.Footer>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  </>)
}

export default SignupModal