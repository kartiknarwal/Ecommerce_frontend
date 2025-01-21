import { server } from '@/main';
import axios from 'axios';
import Cookies from 'js-cookie';
import { createContext, useContext, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);
    const [isAuth, setISAuth] = useState(false);

    // Login User
    async function loginUser(email, navigate) {
        setBtnLoading(true);
        try {
            const { data } = await axios.post(`${server}/api/user/login`, { email });
            toast.success(data.message);
            localStorage.setItem('email', email);
            navigate('/verify');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setBtnLoading(false);
        }
    }

    // Verify User
    async function verifyUser(otp, navigate,fetchCart) {
        setBtnLoading(true);
        const email = localStorage.getItem('email');
        try {
            const { data } = await axios.post(`${server}/api/user/verify`, { email, otp });
            toast.success(data.message);
            localStorage.removeItem('email');
            setISAuth(true);
            setUser(data.user);
            Cookies.set('token', data.token, {
                expires: 15,
                secure: true,
                path: '/',
            });
            fetchCart();

            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Verification failed');
        } finally {
            setBtnLoading(false);
        }
    }

    // Fetch User
    async function fetchUser() {
        const token = Cookies.get('token');
        if (!token) {
            setISAuth(false);
            setLoading(false);
            return;
        }
        try {
            const { data } = await axios.get(`${server}/api/user/me`, {
                headers: { token },
            });
            setISAuth(true);
            setUser(data);
        } catch (error) {
            console.error(error);
            setISAuth(false);
        } finally {
            setLoading(false);
        }
    }

    function logoutUser(navigate,setTotalItem){
        Cookies.set("token",null)
        setUser([])
        setISAuth(false)
        navigate("/login")
        toast.success("Logged out");
        setTotalItem();
    }
    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, btnLoading, isAuth, loginUser, verifyUser,logoutUser }}>
            {children}
            <Toaster />
        </UserContext.Provider>
    );
};

export const UserData = () => useContext(UserContext);
