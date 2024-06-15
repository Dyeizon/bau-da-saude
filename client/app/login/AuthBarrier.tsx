import { useRouter } from "next/navigation";
import { useEffect, ReactNode, useState } from "react";

import { fetchUrl } from "../utils";

const AuthBarrier: React.FC<{children: ReactNode, reverse?: boolean}> = ({ children, reverse=false }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const validateToken = async (token: any): Promise<boolean> => {
        try {
            const response = await fetch(`${fetchUrl}/`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `${token ? `${token}`: ''}`,
              },
              credentials: 'include'
            });

            if(!response.ok) {
              return false;
            }

            return true;
      
      
          } catch (error) {
            console.error(error);
            return false;
          }
    };
    
    useEffect(() => {
        const runTokenCheck = async () => {
            let token = localStorage.getItem('token');
            token = token ? token?.split(' ')[1] : null;
    
            if(reverse) { // User is trying to access a login/register route 
                if(await validateToken(token)) { // Blocks the authenticated user from accessing those routes
                    router.push('/') 
                } else { // User is not authenticated, proceed to the page
                    setIsLoading(false)
                }
    
            } else { // User is trying to access an authenticated route
                if(!token || (token && !await validateToken(token))) { // Blocks the unauthenticated user
                    router.push('/login');
                } 
                
                else { // User is authenticated, proceed to the page
                    setIsLoading(false);                    
                }
            }
        }

        runTokenCheck();
    }, []);

    return (
        <>
            {isLoading ? <></> : <>{children}</>}
        </>
    );

}

export default AuthBarrier;