import { Round } from "./round.type";
import { ShotDetails } from "./shot-details.type";

export type RoundDetailsWithShot = Round & {
    partiesJoueurs: ShotDetails[];
}