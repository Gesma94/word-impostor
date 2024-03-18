import { words } from "./words";

export default class Utils {
    public static getImpostorIndex(max: number) {
        return Math.floor(Math.random() * max);
    }

    public static getWords(areWordsRandom: boolean, secretWord: string, impostorWord: string): { secretWord: string; impostorWord: string; } {
        if (!areWordsRandom) {
            return { secretWord, impostorWord };
        }

        const randomWordsIndex = Math.floor(Math.random() * words.length);
        const randomSecretWordIndex = Math.floor(Math.random() * 2);

        return {
            secretWord: words[randomWordsIndex][randomSecretWordIndex],
            impostorWord: words[randomWordsIndex][randomSecretWordIndex === 0 ? 1 : 0],
        }
    }

}