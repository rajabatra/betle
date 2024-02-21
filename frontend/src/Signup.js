import React, {useState} from 'react' 
import { Link, useNavigate } from 'react-router-dom';
import Validation from './SignUpValidation'
import axios from 'axios'

function Signup(){

        const [values, setValues] = useState({
            name: '',
            email: '',
            password: ''
        })
        const handleInput = (event => {
            const { name, value } = event.target;

    // Trim spaces for all fields and lowercase email and username
    const processedValue = 
        (name === 'email' || name === 'name') 
        ? value.trim().toLowerCase() 
        : value.trim();

        setValues(prev => ({ ...prev, [name]: processedValue }));
        })
        const navigate = useNavigate();
        const [errors, setErrors] = useState({})
        const handleSubmit = (event) => {
            event.preventDefault();
            const err = Validation(values);
            setErrors(err);
            
            if (Object.values(err).every(e => e === "")) {
                axios.post('http://localhost:8081/signup', values)
                .then(res => {
                    navigate('/');
                })
                .catch(error => {
                    if (error.response && error.response.status === 409) {
                        // Handle email already in use error
                        setErrors(prevErrors => ({ ...prevErrors, email: error.response.data.error }));
                    } else {
                        console.log(error);
                    }
                });
            }
        }

    return(
        <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
        <div className='bg-white p-3 rounded w-25'>
            <h2>Sign-Up</h2>
            <form action="" onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label htmlFor="name">Name</label>
                    <input type="text" onChange={handleInput} placeholder='Enter Name' name='name' className='form-control rounded-0'/>
                    {errors.name && <span className='text-danger'> {errors.name} </span>}
                </div>
                <div className='mb-3'>
                    <label htmlFor="email">Email</label>
                    <input type="email" onChange={handleInput} placeholder='Enter Email' name='email' className='form-control rounded-0'/>
                    {errors.email && <span className='text-danger'> {errors.email} </span>}
                </div>
                <div className='mb-3'>
                    <label htmlFor="password">Password</label>
                    <input type="password" onChange={handleInput} placeholder='Enter Password' name='password' className='form-control rounded-0'/>
                    {errors.password && <span className='text-danger'> {errors.password} </span>}
                </div>
                <button type='submit' className='btn btn-success w-100'><strong>Sign Up</strong></button>
                <p>You agree to our terms and policies</p>
                <Link to='/' className='btn btn-default border w-100'>Log In</Link>
            </form>
        </div>
    </div>
    )
}
export default Signup