import { JSX } from 'solid-js';
import { useNavigate } from '@solidjs/router';

export const Page404 = () => {
    const navigate = useNavigate();

    const handleHomepageButton: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = () => {
        navigate('/');
    }

    return (
        <div>
            <h1>404</h1>
            <button class='w-full col-span-2 mt-4' onClick={handleHomepageButton}>Homepage</button>
        </div> 
    )
}