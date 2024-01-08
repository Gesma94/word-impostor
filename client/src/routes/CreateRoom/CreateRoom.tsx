import { A, useNavigate } from '@solidjs/router';
import type { JSX } from 'solid-js'
import { createRenderEffect, createSignal } from 'solid-js'
import { generateRoomId } from './CreateRoom.funcs';

export const CreateRoom = () => {
    const navigate = useNavigate();
    const roomId = generateRoomId();

    const [secretWord, setSecretWord] = createSignal('Gelato');
    const [impostorHasHint, setImpostorHasHint] = createSignal(false);
    const [masterRole, setMasterRole] = createSignal<'active' | 'passive'>('passive');
    const [areWordRandom, setAreWordRandom] = createSignal(false);
    const [impostorWord, setImpostorWord] = createSignal('Ghiacciolo');

    const handleSecretWordChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
        setSecretWord(e.currentTarget.value);
    }

    const handleImpostorWordChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
        setImpostorWord(e.currentTarget.value);
    }

    const handleImpostorHintChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
        setImpostorHasHint(e.currentTarget.checked);
    }

    const handleMasterRoleChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
        const newValue = e.currentTarget.value;

        if (newValue !== 'active' && newValue !== 'passive') {
            return;
        }

        setMasterRole(newValue);
    }

    const handleWordRandomChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
        const newValue = e.currentTarget.value;

        if (newValue === 'random') {
            setAreWordRandom(true);
        }
        else if (newValue === 'fixed') {
            setAreWordRandom(false);
        }
    }

    const handleCreateRoomClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = async (_) => {
        const searchParms = new URLSearchParams();

        if (areWordRandom()) {
            searchParms.append('areRandomWord', 'true');
        }
        else {
            searchParms.append('areRandomWord', 'false');
            searchParms.append('secretWord', secretWord());
            searchParms.append('impostorWord', impostorWord());
        }

        searchParms.append('impostorHasHint', impostorHasHint() ? 'true' : 'false');
        searchParms.append('masterRole', masterRole());

        navigate(`/room/${roomId}/admin?${searchParms.toString()}`);
    }

    createRenderEffect(() => {
        if (masterRole() === 'active') {
            setAreWordRandom(true);
        }
    });

    return (
        <div class='h-full grid place-content-center'>
            <div class='w-[320px]'>
                <label for='activeMaster'>Active Master</label>
                <input id='activeMaster' name='activeMaster' type='radio' value={'active'} checked={masterRole() === 'active'} onInput={handleMasterRoleChange} />
                <label for='passiveMaster'>Passive Master</label>
                <input id='passiveMaster' name='activeMaster' type='radio' value={'passive'} checked={masterRole() === 'passive'} onInput={handleMasterRoleChange} />
                <br />
                <label for='impostorHint'>Impostor has hint</label>
                <input id='impostorHint' type='checkbox' checked={impostorHasHint()} onInput={handleImpostorHintChange} />
                <br />
                <label for='randomWord'>Random Word</label>
                <input id='randomWord' name='randomWord' type='radio' value={'random'} checked={areWordRandom()} onInput={handleWordRandomChange} disabled={masterRole() === 'active'} />
                <label for='fixedWord'>Fixed Word</label>
                <input id='fixedWord' name='fixedWord' type='radio' value={'fixed'} checked={!areWordRandom()} onInput={handleWordRandomChange} disabled={masterRole() === 'active'} />   
                <br />
                <label for='secretWord'>Secret Word:</label>
                <input id='secretWord' value={secretWord()} onInput={handleSecretWordChange} disabled={areWordRandom()} />
                <br />
                <label for='secretWord'>Impostor Word:</label>
                <input id='secretWord' value={impostorWord()} onInput={handleImpostorWordChange} disabled={areWordRandom()} />
                <br />
                <button onClick={handleCreateRoomClick}>Create Room</button>
                <hr />
                <p>Or, <A href='/join-room'>join an existing room</A></p>
            </div>
        </div>
    )
}
