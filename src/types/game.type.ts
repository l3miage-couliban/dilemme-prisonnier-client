import type { Player } from "./player.type"
import type { Round } from "./round.type"

export type Game = {
    id: number,
    statut: string,
    nombreParties: number,
    parties: Round[],
    joueurs: Player[],
}