import { Home } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        const redirectTimer = setTimeout(() => {
            navigate("/");
        }, 10000);

        return () => {
            clearInterval(timer);
            clearTimeout(redirectTimer);
        };
    }, [navigate]);

    return (
        <div className='h-screen w-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-100'>
            <div className='relative'>
                <img
                    className='size-72 object-cover'
                    src="./Hand-No-Sticker.gif"
                />
            </div>
            <h3 className='text-2xl font-bold mt-4'>Uh Uh Uh you are not authorized to use this page🙅🏻🙅🏻</h3>
            <button
                onClick={() => navigate("/")}
                className='mt-10 mb-6 px-4 py-2 bg-cyan-500 text-black rounded hover:bg-cyan-600 flex items-center'
            >
                <Home className='mr-2'/>
                Go to Home
            </button>
            <p className='mt-2 text-sm'>You will be redirected to the home page in {countdown} seconds...</p>
        </div>
    );
};

export default UnauthorizedPage;
