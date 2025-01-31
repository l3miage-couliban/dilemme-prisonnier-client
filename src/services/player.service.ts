import type { QuitGameRequest } from "~/types/quit-game-request.type";
import axios from "axios";

export class PlayerService {
    async quitGame(data: QuitGameRequest) {
        try {
            const response = await axios.patch(`${import.meta.env.PUBLIC_SERVER_URL}/joueurs/${data.playerId}/abandonner`, {
                strategie: data.strategy
            });
            
            return ({
                success: true,
                data: response.data
            });
        } catch (error) {
            return ({
                success: false,
                data: undefined
            });
        }
    }
}