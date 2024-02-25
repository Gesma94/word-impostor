import { JSX, createSignal } from "solid-js";

type TSecretWord = {
    secretWord: string;
}

export const SecretWord = (props: TSecretWord) => {
    const [showWord, setShowWord] = createSignal<boolean>(false);

    const handleTouchStart : JSX.EventHandlerUnion<HTMLDivElement, TouchEvent> = (_) => {
        setShowWord(true);
    }

    const handleTouchEnd : JSX.EventHandlerUnion<HTMLDivElement, TouchEvent> = (_) => {
        setShowWord(false);
    }

    const handleMouseEnter : JSX.EventHandlerUnion<HTMLDivElement, MouseEvent> = (_) => {
        setShowWord(true);
    }

    const handleMouseLeave : JSX.EventHandlerUnion<HTMLDivElement, MouseEvent> = (_) => {
        setShowWord(false);
    }

    return (
        <div class='min-w-[200px] bg-[#FFF] border-red border-2 rounded-lg cursor-pointer' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <p class={`text-wrap text-center p-2 transition-opacity duration-500 ${showWord() ? 'opacity-1' : 'opacity-0'}`}>{props.secretWord}</p>
        </div>
    );
}