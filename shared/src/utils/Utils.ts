export default class SharedUtils {
    public static isNotNullOrUndefined<T>(value: T): value is NonNullable<T> {
        return value !== undefined && value !== null;
    }

    public static isNullOrUndefined(value: unknown): value is null | undefined {
        return value === undefined || value === null;
    }
}