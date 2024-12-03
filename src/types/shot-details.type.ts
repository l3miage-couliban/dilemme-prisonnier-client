import type { Player } from "./player.type";
import type { Round } from "./round.type";

export type ShotDetails = {
    coup: string;
    score: number;
    joueur: Player;
    partie: Round;
}