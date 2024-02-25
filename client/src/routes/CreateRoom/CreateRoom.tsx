import { onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import Utils from '../../common/Utils';
import { LoadScreen } from '../../components/LoadScreen/LoadScreen';
import { ERROR_ID_CANNOT_CREATE_ROOM } from '../../common/constants';

export const CreateRoom = () => {
    const navigate = useNavigate();

    onMount(async () => {
        const apiUrl = import.meta.env.VITE_SERVER_BASE_URL;

        try {
            const searchParams = new URLSearchParams();
            searchParams.append("masterUuid", Utils.getUserUuid());

            const apiResponse = await fetch(`${apiUrl}/room/create?${searchParams.toString()}`);

            if (!apiResponse.ok) {
                navigate(`/error/${ERROR_ID_CANNOT_CREATE_ROOM}`);
                return;
            }
            
            const newRoomUuid = await apiResponse.text();
            navigate(`/room/${newRoomUuid}/master`, { replace: true });
        }
        catch(e) {
            navigate('/error');
        }
    });

    return <LoadScreen isVisible={true} message='Creating the room' />
}