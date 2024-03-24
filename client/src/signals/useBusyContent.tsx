import { Accessor, createSignal } from "solid-js"

type TCreateBusyContentReturnType = [Accessor<boolean>, Accessor<string>, (newMessage: string) => void, () => void]

export const useBusyContent = (initialIsBusy: boolean, initialBusyContent: string): TCreateBusyContentReturnType => {
    const [isBusy, setIsBusy] = createSignal(initialIsBusy);
    const [busyContent, setBusyContent] = createSignal(initialBusyContent);

    const handleSetBusy = (newMessage: string) => {
        setIsBusy(true);
        setBusyContent(newMessage);
    }

    const handleSetNotBusy = () => {
        setBusyContent("");
        setIsBusy(false);
    }

    return [isBusy, busyContent, handleSetBusy, handleSetNotBusy];
}