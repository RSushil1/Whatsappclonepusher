import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Spinner = () => {
    const [count, setCount] = useState(3);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((preValue) => --preValue);
        }, 100000);
        count === 0 && navigate('/', {
            state: location.pathname
        });
        return () => clearInterval(interval)
    }, [count, navigate, location])

    return (
        <>
            <div className="flex flex-col justify-center items-center">
                <div className="flex justify-center items-center h-[50vh]">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                </div>
                <h1 className="text-center font-serif font-bold text-2xl m-5">redirecting to you in {count} seconds</h1>
            </div>

        </>
    )
}

export default Spinner