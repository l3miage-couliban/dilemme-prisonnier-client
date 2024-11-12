import { QuitGameRequest } from "~/types/quit-game-request.type";
import axios from "axios";

export class PlayerService {
    async quitGame(data: QuitGameRequest) {
        try {
            const response = await axios.patch(`${import.meta.env.PUBLIC_SERVER_URL}/joueurs/${data.playerId}/abandonner`, {
                strategie: data.strategy
            });
            console.log(response.data);
            
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