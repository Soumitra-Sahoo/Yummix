import React, { useState } from 'react'
import './Login.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { url } from '../../assets/assets'

const Login = ({ setToken }) => {

    const [data,setData] = useState({
        email:"",
        password:""
    })

    const navigate = useNavigate();

    const onChangeHandler = (event)=>{
        const name = event.target.name;
        const value = event.target.value;

        setData(data=>({...data,[name]:value}))
    }

    const onSubmitHandler = async (event)=>{

        event.preventDefault();

        try {

            const response = await axios.post(
                `${url}/api/admin/login`,
                data
            )

            if(response.data.success){

                localStorage.setItem(
                    "adminToken",
                    response.data.token
                )

                setToken(response.data.token)

                toast.success("Login Successful")

                navigate("/add")

            }else{
                toast.error(response.data.message)
            }

        } catch (error) {

            console.log(error);

            toast.error("Error")
        }
    }

    return (
        <div className='login'>

            <form className='login-form' onSubmit={onSubmitHandler}>

                <h2>Admin Login</h2>

                <input
                    type="email"
                    name='email'
                    placeholder='Email'
                    onChange={onChangeHandler}
                    required
                />

                <input
                    type="password"
                    name='password'
                    placeholder='Password'
                    onChange={onChangeHandler}
                    required
                />

                <button type='submit'>
                    Login
                </button>

            </form>

        </div>
    )
}

export default Login