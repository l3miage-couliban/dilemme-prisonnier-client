import { Player } from "./player.type"

export type CreateGameResponse = {
    id: number,
    statut: string,
    nombreParties: number,
    joueurCree: Player,
}