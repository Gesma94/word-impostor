import type { JSX } from 'solid-js'
import { generateRoomId } from './CreateRoom.funcs';
import { createRenderEffect, createSignal } from 'solid-js';
import { A, useNavigate, useParams, useSearchParams } from '@solidjs/router';
import { PARAM_KEY_ARE_RANDOM_WORD, PARAM_KEY_IMPOSTOR_HAS_HINT, PARAM_KEY_IMPOSTOR_WORD, PARAM_KEY_IS_MASTER_PLAYING, PARAM_KEY_ROOM_RESET_GUID, PARAM_KEY_SECRET_WORD } from '../../common/constants';

type TCreateRoomParams = {
    roomId: string;
}

type TCreateRoomSearchParams = {
    roomResetGuid?: string;
}

export const CreateRoom = () => {
    const navigate = useNavigate();
    const params = useParams<TCreateRoomParams>();
    const roomId = params.roomId ?? generateRoomId();
    const [searchParams] = useSearchParams<TCreateRoomSearchParams>();
    
    const [secretWord, setSecretWord] = createSignal('');
    const [impostorWord, setImpostorWord] = createSignal('');
    const [areWordRandom, setAreWordRandom] = createSignal(false);
    const [impostorHasHint, setImpostorHasHint] = createSignal(false);
    const [isMasterPlaying, setIsMasterPlaying] = createSignal(false);

    const handleSecretWordChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
        setSecretWord(e.currentTarget.value);
    }

    const handleImpostorWordChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
        setImpostorWord(e.currentTarget.value);
    }

    const handleImpostorHasHintChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
        setImpostorHasHint(e.currentTarget.checked);
    }

    const handleIsMasterPlayingChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
        setIsMasterPlaying(e.currentTarget.value === 'masterIsPlaying');
    }

    const handleAreWordRandomChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
        setAreWordRandom(e.currentTarget.value === 'randomWord');
    }

    const handleFormSubmit: JSX.EventHandler<HTMLFormElement, Event> = (e) => {
        e.preventDefault();

        const searchParms = new URLSearchParams();
        const innerAreWordRandom = areWordRandom();
      
        if (innerAreWordRandom) {
            searchParms.append(PARAM_KEY_ARE_RANDOM_WORD, innerAreWordRandom.toString());
        }
        else {
            searchParms.append(PARAM_KEY_SECRET_WORD, secretWord());
            searchParms.append(PARAM_KEY_IMPOSTOR_WORD, impostorWord());
        }

        searchParms.append(PARAM_KEY_IS_MASTER_PLAYING, isMasterPlaying().toString());
        searchParms.append(PARAM_KEY_IMPOSTOR_HAS_HINT, impostorHasHint().toString());

        if (searchParams?.roomResetGuid) {
            searchParms.append(PARAM_KEY_ROOM_RESET_GUID, searchParams.roomResetGuid);
        }

        navigate(`/room/${roomId}/admin?${searchParms.toString()}`);
    }

    createRenderEffect(() => {
        if (isMasterPlaying()) {
            setAreWordRandom(true);
        }
    });

    return (
        <div class='h-full grid place-content-center'>
            <div class='w-[320px]'>
                <form onSubmit={handleFormSubmit}>
                    <label for='masterIsPlaying'>Master is playing</label>
                    <input
                        type='radio'
                        id='masterIsPlaying'
                        name='masterIsPlaying'
                        value='masterIsPlaying'
                        checked={isMasterPlaying()}
                        onInput={handleIsMasterPlayingChange} />
                    <label for='masterNotPlaying'>Master is not playing</label>
                    <input
                        type='radio'
                        id='masterNotPlaying'
                        name='masterNotPlaying'
                        value='masterNotPlaying'
                        checked={!isMasterPlaying()}
                        onInput={handleIsMasterPlayingChange} />
                    <br />
                    <label for='impostorHint'>Impostor has hint</label>
                    <input
                        type='checkbox'
                        id='impostorHint'
                        name='impostorHint'
                        checked={impostorHasHint()}
                        onInput={handleImpostorHasHintChange} />
                    <br />
                    <label for='randomWord'>Random Word</label>
                    <input
                        type='radio'
                        id='randomWord'
                        name='randomWord'
                        value='randomWord'
                        checked={areWordRandom()}
                        disabled={isMasterPlaying()}
                        onInput={handleAreWordRandomChange} />
                    <label for='fixedWord'>Fixed Word</label>
                    <input
                        type='radio'
                        id='fixedWord'
                        name='fixedWord'
                        value='fixedWord'
                        checked={!areWordRandom()}
                        disabled={isMasterPlaying()}
                        onInput={handleAreWordRandomChange} />
                    <br />
                    <label for='secretWord'>Secret Word:</label>
                    <input
                        id='secretWord'
                        name='secretWord'
                        value={secretWord()}
                        disabled={areWordRandom()}
                        onInput={handleSecretWordChange} />
                    <br />
                    <label for='secretWord'>Impostor Word:</label>
                    <input
                        id='impostorWord'
                        name='impostorWord'
                        value={impostorWord()}
                        disabled={areWordRandom()}
                        onInput={handleImpostorWordChange} />
                    <br />
                    <button type='submit'>Create Room</button>
                </form>
                <hr />
                <p>Or, <A href='/join-room'>join an existing room</A></p>
            </div>
        </div>
    )
}
