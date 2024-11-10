export type Player = {
    id: string,
    nom: string,
    strategie: string | null,
    abandon: boolean | null
} | undefined;