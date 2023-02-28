export type IOption<S,A> = {state:S,actions?:A}
export type OnlyString<T> = Exclude<T,symbol|number> 