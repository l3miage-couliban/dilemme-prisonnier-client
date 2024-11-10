import { Player } from "./player.type";
import { Round } from "./round.type";

export type ShotDetails = {
    coup: string;
    score: number;
    joueur: Player;
    partie: Round;
}