import axios from "axios";
import { PlayShotRequest } from "~/types/play-shot-request.type";
import { RoundDetailsWithShots } from "~/types/round-details-with-shots.type";

export class RoundService {
    async getRoundDetails(roundId: String): Promise<RoundDetailsWithShots> {
        return axios.get(`${import.meta.env.PUBLIC_SERVER_URL}/parties/${roundId}/details`).then(response => response.data as RoundDetailsWithShots);
    }

    async playShot(gameId: number, data: PlayShotRequest) {
        try {
            const response = await axios.post(`${import.meta.env.PUBLIC_SERVER_URL}/parties/${gameId}/joueurs/${data.playerId}/jouer-coup`, {
                coup: data.shot
            });
            return ({ success: true, data: response.data });
        } catch (_) {
            return ({ success: false, data: undefined });
        }
    }
}