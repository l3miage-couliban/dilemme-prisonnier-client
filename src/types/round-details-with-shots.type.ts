import type { Round } from "./round.type";
import type { ShotDetails } from "./shot-details.type";

export type RoundDetailsWithShots = Round & {
    partiesJoueurs: ShotDetails[];
}