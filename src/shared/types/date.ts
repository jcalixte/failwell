export type ISODate = string

export const toISODate = (date: Date): ISODate => date.toISOString()
