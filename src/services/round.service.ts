import axios from "axios";
import { RoundDetailsWithShots } from "~/types/round-details-with-shots.type";

export class RoundService {
    async getRoundDetails(roundId: String): Promise<RoundDetailsWithShots> {
        return axios.get(`${import.meta.env.PUBLIC_SERVER_URL}/parties/${roundId}/details`).then(response => response.data as RoundDetailsWithShots);
    }
}