type Brand<K, T> = K & { __brand: T }

export type ISODate = Brand<string, 'ISODate'>

export const toISODate = (date: Date): ISODate => date.toISOString() as ISODate
