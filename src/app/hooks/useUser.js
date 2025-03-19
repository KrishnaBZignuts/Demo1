import { useState, useEffect } from 'react';
const useUser = () => {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('loggedInUser') || 'null'); 
        } catch {
            return null; 
        }
    });
    useEffect(() => {
        const handleStorageChange = () => {
            try {
                setUser(JSON.parse(localStorage.getItem('loggedInUser') || 'null'));
            } catch {
                setUser(null);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
    return user;
};
export default useUser;












