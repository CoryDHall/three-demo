declare type Updater<T> = (cb: (arg: T) => void) => void;
declare type StateHook<T> = [T, Updater<T>];
