import React, {useState, useEffect} from 'react' 
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Validation from './LoginValidation';
import axios from 'axios'


function Login({ setIsLoggedIn }) {
        
        const [values, setValues] = useState({
            email: '',
            password: ''
        })
        const navigate = useNavigate()
        const [errors, setErrors] = useState({})
        useEffect(() => {
            // Check if user is already logged in
            const token = localStorage.getItem('authToken');
            if (token) {
                setIsLoggedIn(true);
                navigate('/home');
            }
        }, [setIsLoggedIn, navigate]);

        const handleInput = event => {
            setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
        };
        

        const handleSubmit = event => {
            event.preventDefault();
            const err = Validation(values);
            
            setErrors(err);
        
            if (err.email === "" && err.password === "") {
                axios.post('http://localhost:8081/login', values)
                    .then(res => {
                        if (res.data.success) {
                            setIsLoggedIn(true);  // Set login state
                            localStorage.setItem('authToken', res.data.token);
                            navigate('/home', { state: { username: res.data.user.username, id: res.data.user.id } }); 
                        } else {
                            alert("No record exists");
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        alert("Login failed: " + error.response.data.error);
                    });
            }
        };

    return (
        <div className='d-flex justify-content-center align-items-center bg-black vh-100'>
            <div className='bg-dark p-3 rounded'>
            <h2 className='text-white'>Sign-In</h2>
                <form action="" onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label className='text-white' htmlFor="email">Email</label>
                        <input type="email" placeholder='Enter Email'  onChange={handleInput} className='form-control rounded-0' name='email'/>
                        {errors.email && <span className='text-danger'> {errors.email} </span>}
                    </div>
                    
                    <div className='mb-3'>
                        <label className='text-white' htmlFor="password">Password</label>
                        <input type="password" placeholder='Enter Password'  onChange={handleInput} name='password' className='form-control rounded-0'/>
                        {errors.password && <span className='text-danger'> {errors.password} </span>}
                    </div>
                    <button type='submit' className='btn btn-success w-100'><strong>Log in</strong></button>
                    <p className='text-white'>You agree to our terms and policies</p>
                    <Link to='/signup' className='btn text-white btn-default border w-100'>Create account</Link>
                </form>
            </div>
        </div>
    )
}
export default Login;