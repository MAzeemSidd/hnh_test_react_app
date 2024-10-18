import axios from 'axios';
import { Field, Formik, Form as FormikForm } from 'formik'
import React, { useContext, useRef, useState } from 'react'
import { Alert, Button } from 'react-bootstrap'
import * as Yup from 'yup';
import { AuthContext } from '../context/LoginContext';
import { Button as Antd_Button, Modal, Alert as Antd_Alert } from 'antd';

const loginSchema = Yup.object().shape({
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

const LoginModal = ({showLoginModal, handleLoginModalClose}) => {
  const auth = useContext(AuthContext)
  const [errorMsg, setErrorMsg] = useState('')
  const formikRef = useRef()

  const handleClose = () => {
    setErrorMsg('')
    formikRef.current?.resetForm()
    handleLoginModalClose();
  }

  return (<>
    <Formik
      innerRef={formikRef}
      initialValues={{
        email: '',
        password: ''
      }}
      validationSchema={loginSchema}
      onSubmit={async (values, { resetForm }) => {
        try {
          if(errorMsg) setErrorMsg('')
          const response = await axios.post('http://localhost:9000/users/login', values)
          if(response?.status === 200){
            auth.loginUser(response?.data)
            console.log(response?.data)
            handleLoginModalClose();
            resetForm()
          }
        } catch (error) {
          console.log('LoginModal - error -->', error)
          if(error?.response) setErrorMsg(error?.response?.data)
          else setErrorMsg('Network Error')
        }
      }}
    >
      {({ errors, touched, handleSubmit, isSubmitting }) => (
      /* OnSubmit and onKeyDown is used here for the form submission on
      enter button, and that's why we don't need to pass handleSubmit()
      function inside onOk prop of Antd Modal */
      <FormikForm
        onSubmit={handleSubmit} 
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit();
          }
        }}
      >
        <Modal
          title={<text style={{fontSize: 22}}>Login</text>}
          open={showLoginModal}
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
                Login
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
              <label for="email" className='mb-1 ms-1 text-secondary fs-6'>Email address</label>
              <Field name="email" type='email' id='email' className='form-control' placeholder='email@example.com' />
              {errors.email && touched.email ? <div className='text-danger'>{errors.email}</div> : null}
            </div>

            <div className="form-group my-3">
              <label for="password" className='mb-1 ms-1 text-secondary fs-6'>Password</label>
              <Field name="password" type='password' id='password' className='form-control' placeholder='Provide a strong password' />
              {errors.password && touched.password ? <div className='text-danger'>{errors.password}</div> : null}
            </div>
          
        </Modal>
      </FormikForm>
      )}
    </Formik>
    {/* <Modal
      show={showLoginModal}
      onHide={()=> {
        setErrorMsg('')
        handleLoginModalClose();
      }}
      onExit={()=> {
        setErrorMsg('')
        handleLoginModalClose();
      }}
    >
      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        validationSchema={loginSchema}
        onSubmit={async (values) => {
          try {
            if(errorMsg) setErrorMsg('')
            const response = await axios.post('http://localhost:9000/users/login', values)
            if(response?.status === 200){
              auth.loginUser(response?.data)
              console.log(response?.data)
              handleLoginModalClose();
            }
          } catch (error) {
            console.log('LoginModal - error -->', error?.response?.data)
            setErrorMsg(error?.response?.data)
          }
        }}
      >
        {({ errors, touched }) => (
          <FormikForm>
            <Modal.Header closeButton>
              <Modal.Title>Login</Modal.Title>
            </Modal.Header>

            <Modal.Body>

              {
                errorMsg && (
                  <Alert variant='danger' className='py-2 m-0'>
                    <i style={{fontSize: 20}} class="bi bi-exclamation-triangle-fill text-danger me-2"></i>
                    <text className='text-danger ms-2'>{errorMsg}</text>
                  </Alert>
                )
              }

              <div className="form-group my-3">
                <label for="email">Email address</label>
                <Field name="email" type='email' id='email' className='form-control' placeholder='email@example.com' />
                {errors.email && touched.email ? <div className='text-danger'>{errors.email}</div> : null}
              </div>

              <div className="form-group my-3">
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
    </Modal> */}
  </>)
}

export default LoginModal