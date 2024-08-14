import React, { useState, useEffect } from 'react'
import Wrapper from '../assets/wrappers/RegisterPage'
import { Logo, FormRow, Alert } from '../components'
import { useAppContext } from '../context/appContext'
import { useNavigate } from 'react-router-dom'
const initialState = {
    name: '',
    email: '',
    password: '',
    isMember: true,
    showAlert: false
}
const Register = () => {
    const { displayAlert, showAlert, setupUser, isLoading, user } = useAppContext()
    const [values, setValues] = useState(initialState)
    const navigate = useNavigate()
    useEffect(() => {
        if (user) {
            setTimeout(() => {
                navigate('/')
            }, 1500)
        }
    }, [user, navigate])
    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value;
        setValues({ ...values, [name]: value })
    }
    const onSubmit = (e) => {
        e.preventDefault()
        const { name, email, password, isMember } = values;
        if (!email || !password || (!isMember && !name)) {
            displayAlert()
            return
        }
        const currentUser = { name, email, password }
        if (isMember) {
            setupUser(currentUser, 'login', 'successfully loggoed in ! redirecting ...')
        }
        else {
            setupUser(currentUser, 'register', 'successfully created! redirecting ...')
        }
    }
    const toggleMember = () => {
        setValues({ ...values, isMember: !values.isMember })
    }
    return (
        <Wrapper className='full-page'>
            <form className='form' onSubmit={onSubmit}>
                <Logo />

                <h3>
                    {values.isMember ? 'login' : 'register'}
                </h3>
                {
                    showAlert && <Alert />
                }
                {/* name field */}
                {
                    !values.isMember &&
                    <FormRow
                        type='text'
                        value={values.name}
                        name='name'
                        handleChange={handleChange}
                    />
                }


                {/* email field */}
                <FormRow
                    type='email'
                    value={values.email}
                    name='email'
                    handleChange={handleChange}
                />
                {/* password field */}
                <FormRow
                    type='password'
                    value={values.password}
                    name='password'
                    handleChange={handleChange}
                />

                <button type='submit' className='btn btn-block' disabled={isLoading}>
                    submit
                </button>
                <p>
                    {values.isMember ? 'Not a member yet?' : 'Already a member?'}

                    <button type='button' onClick={toggleMember} className='member-btn'>
                        {values.isMember ? 'Register' : 'Login'}
                    </button>
                </p>

            </form>
        </Wrapper>
    )
}

export default Register
