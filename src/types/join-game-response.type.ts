import type { Player } from "./player.type";

export type JoinGameResponse = {
    id: number,
    statut: string,
    joueurCree: Player,
}