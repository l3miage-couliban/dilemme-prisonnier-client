import { Round } from "./round.type";
import { ShotDetails } from "./shot-details.type";

export type RoundDetailsWithShots = Round & {
    partiesJoueurs: ShotDetails[];
}