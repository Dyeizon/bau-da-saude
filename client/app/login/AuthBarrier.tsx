import { useRouter } from "next/navigation";
import { useEffect, ReactNode, useState } from "react";

import {jwtDecode} from "jwt-decode"; 


const AuthBarrier: React.FC<{children: ReactNode, reverse?: boolean}> = ({ children, reverse=false }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const validateToken = (token: any): boolean => {
        try {
            const decodedToken: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            console.log(decodedToken);

            if (decodedToken.exp && decodedToken.exp < currentTime) {
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error decoding or validating token:', error);
            return false;
        }
    };
    
    useEffect(() => {
        const token = localStorage.getItem('token');

        if(reverse) { // User is trying to access a login/register route 
            if(validateToken(token)) { // Blocks the authenticated user from accessing those routes
                router.push('/') 
            } else { // User is not authenticated, proceed to the page
                setIsLoading(false)
            }

        } else { // User is trying to access an authenticated route
            if(!token || (token && !validateToken(token))) { // Blocks the unauthenticated user
                router.push('/login');
            } 
            
            else { // User is authenticated, proceed to the page
                
                setIsLoading(false);
                
            }
        }
        
    }, []);

    return (
        <>
            {isLoading ? <></> : <>{children}</>}
        </>
    );

}

export default AuthBarrier;