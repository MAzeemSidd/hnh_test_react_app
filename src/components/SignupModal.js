import axios from 'axios';
import { Field, Formik, Form as FormikForm } from 'formik'
import React, { useContext, useRef, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { Button as Antd_Button, Modal as Antd_Modal, Alert as Antd_Alert, Input } from 'antd';
import * as Yup from 'yup';
import { AuthContext } from '../context/LoginContext';

const SignupSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(3, 'First name must be at least 3 characters')
    .max(25, 'First name must be at most 25 characters')
    .required('First name is required'),
  
  lastname: Yup.string()
    .min(3, 'Last name must be at least 3 characters')
    .max(10, 'Last name must be at most 10 characters')
    .required('Last name is required'),
  
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[\W_]/, 'Password must contain at least one special character')
    .required('Password is required'),
});

const SignupModal = ({showSignupModal, handleSignupModalClose}) => {
  const auth = useContext(AuthContext)
  const [errorMsg, setErrorMsg] = useState('')
  const formikRef = useRef()

  const handleClose = () => {
    setErrorMsg('')
    formikRef.current?.resetForm()
    handleSignupModalClose()
  }

  return (<>
    {/* <Modal show={showSignupModal} onHide={handleClose} onExit={handleClose}> */}
    <Formik
      innerRef={formikRef}
      initialValues={{
        firstname: '',
        lastname: '',
        email: '',
        password: ''
      }}
      validationSchema={SignupSchema}
      onSubmit={async (values, { resetForm }) => {
        console.log(JSON.stringify(values));
        try {
          if(errorMsg) setErrorMsg('')

          const response = await axios.post('http://localhost:9000/users/signup', values)
          
          if(response?.status === 200){
            auth.loginUser(response?.data)
            console.log('response.data', response?.data)
            handleSignupModalClose()
            resetForm()
          }
        }
        catch(error) {
          console.log('SignupModal - error -->', error)

          if(error?.response) setErrorMsg(error?.response?.data)
          else setErrorMsg('Network Error')
        }
      }}
    >
      {({ errors, touched, handleSubmit, isSubmitting }) => (
        /* This onSubmit and onKeyDown props is used here to send
        the request on user press enter from keyboard */
        <FormikForm
          onSubmit={handleSubmit} 
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
        >
          {/* <Modal.Header closeButton>
            <Modal.Title>Create Account</Modal.Title>
          </Modal.Header>

          <Modal.Body> */}
          <Antd_Modal
            title={<text style={{fontSize: 22}}>Login</text>}
            open={showSignupModal}
            // onOk={handleSubmit}
            onCancel={handleClose}
            onClose={handleClose}
            keyboard={true}
            autoFocusButton='ok'
            footer={
              <>
                <Antd_Button type='secondary' onClick={handleClose}>
                  Close
                </Antd_Button>
                <Antd_Button htmlType='submit' type="primary" loading={isSubmitting} onClick={handleSubmit}>
                  Signup
                </Antd_Button>
              </>
            }
            styles={{
              mask: { backdropFilter: 'blur(5px)', background: 'rgba(0,0,0,.1)' },
              body: { padding: '15px 0' }
            }}
            destroyOnClose={true}
            centered={true}
          >
            {
              errorMsg && (
                <Antd_Alert
                  type="error"
                  message={
                    <div className='mx-2 mt-0 mb-1'>
                      <i style={{fontSize: 20}} class="bi bi-exclamation-triangle-fill text-danger me-2"></i>
                      <text className='text-danger ms-2'>{errorMsg}</text>
                    </div>
                  }
                />
              )
            }
            
            <div className="form-group my-3">
              <label for="firstname" className='mb-1 ms-1 text-secondary fs-6'>First Name</label>
              <Field name="firstname" id='firstname' className='form-control' placeholder='e.g. "John"' />
              {errors.firstname && touched.firstname ? <div className='text-danger'>{errors.firstname}</div> : null}
            </div>

            <div className="form-group my-3">
              <label for="lastname" className='mb-1 ms-1 text-secondary fs-6'>Last Name</label>
              <Field name="lastname" id='lastname' className='form-control' placeholder='e.g. "Doe"' />
              {errors.lastname && touched.lastname ? <div className='text-danger'>{errors.lastname}</div> : null}
            </div>

            <div className="form-group my-3">
              <label for="email" className='mb-1 ms-1 text-secondary fs-6'>Email address</label>
              <Field name="email" type='email' id='email' className='form-control' placeholder='email@example.com' />
              {errors.email && touched.email ? <div className='text-danger'>{errors.email}</div> : null}
            </div>

            <div className="form-group my-3">
              <label for="password" className='mb-1 ms-1 text-secondary fs-6'>Password</label>
              <Field name="password" type='password' id='password' className='form-control border-2 rounded-2' placeholder='Choose a strong password' />
              {errors.password && touched.password ? <div className='text-danger'>{errors.password}</div> : null}
            </div>
          
          </Antd_Modal>
          {/* </Modal.Body>

          <Modal.Footer>
            <Button variant="light" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type='submit'>
              signup
            </Button>
          </Modal.Footer> */}
        </FormikForm>
      )}
    </Formik>
    {/* </Modal> */}
  </>)
}

export default SignupModal