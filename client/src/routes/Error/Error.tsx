import { JSX } from 'solid-js';
import { useNavigate } from '@solidjs/router';

export const Error = () => {
    const navigate = useNavigate();

    const handleHomepageButton: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = () => {
        navigate('/');
    }

    return (
        <div>
            <h1>Error</h1>
            <p>Something went wrong</p>
            <button class='w-full col-span-2 mt-4' onClick={handleHomepageButton}>Homepage</button>
        </div> 
    )
}