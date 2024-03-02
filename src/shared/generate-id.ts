import hash from 'md5'

export const generateId = (seed: string): string => hash(seed)
