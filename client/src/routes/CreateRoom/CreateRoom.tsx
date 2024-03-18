import { onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { LoadScreen } from '../../components/LoadScreen/LoadScreen';
import { API_ROUTES, ROUTES } from '../../common/constants';
import Utils from 'src/common/Utils';

export const CreateRoom = () => {
    const navigate = useNavigate();

    onMount(async () => {

        try {
            const apiResponse = await fetch(API_ROUTES.CREATE_ROOM(Utils.getUserUuid()));

            if (!apiResponse.ok) {
                navigate(ROUTES.ERROR);
                return;
            }
            
            const newRoomUuid = await apiResponse.text();
            navigate(ROUTES.ROOM_MASTER(newRoomUuid), { replace: true });
        }
        catch(e) {
            navigate(ROUTES.ERROR);
        }
    });

    return <LoadScreen isVisible={true} message='Creating the room' />
}