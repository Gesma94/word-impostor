import { JSX } from 'solid-js';
import { useNavigate, useParams } from '@solidjs/router';
import { ERROR_ID } from '../../common/constants';

type TErrorId = typeof ERROR_ID.CANNOT_CREATE_ROOM | 'other';

type TErrorParams = {
    errorId: TErrorId;
}

export const Error = () => {
    const params = useParams<TErrorParams>();
    const navigate = useNavigate();

    const getErrorMessage = () => {
        switch (params.errorId) {
            case 'cannot-create-room': return 'Cannot create room';
            default: return 'something went wrong';
        }
    }


    const handleHomepageButton: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = () => {
        navigate('/');
    }



    return (
        <div>
            <h1>Error</h1>
            <p>{getErrorMessage()}</p>
            <button class='w-full col-span-2 mt-4' onClick={handleHomepageButton}>Homepage</button>
        </div> 
    )
}