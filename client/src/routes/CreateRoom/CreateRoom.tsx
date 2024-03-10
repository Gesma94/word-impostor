import { onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { LoadScreen } from '../../components/LoadScreen/LoadScreen';
import { ROUTES, ERROR_ID } from '../../common/constants';
import { API_ROUTES } from '../../common/apiUrl';

export const CreateRoom = () => {
    const navigate = useNavigate();

    onMount(async () => {

        try {
            const apiResponse = await fetch(API_ROUTES.CREATE_ROOM);

            if (!apiResponse.ok) {
                navigate(ROUTES.ERROR(ERROR_ID.CANNOT_CREATE_ROOM));
                return;
            }
            
            const newRoomUuid = await apiResponse.text();
            navigate(ROUTES.ROOM_MASTER(newRoomUuid), { replace: true });
        }
        catch(e) {
            navigate(ROUTES.ERROR());
        }
    });

    return <LoadScreen isVisible={true} message='Creating the room' />
}