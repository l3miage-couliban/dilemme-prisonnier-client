import axios from 'axios';
import { CreateGameResponse } from '~/types/create-game-response.type';
import { CreateGame } from '~/types/create-game.type';
import { Game } from '~/types/game.type';
import { JoinGameResponse } from '~/types/join-game-response.type';
import { JoinGame } from '~/types/join-game.type';

export class GameService {
    async createGame(data: CreateGame): Promise<CreateGameResponse> {
       return axios.post(`${import.meta.env.PUBLIC_SERVER_URL}/jeux/creer-jeu`, {
            pseudoJoueur: data.playerNickname,
            nombreParties: data.partiesNumber
        }).then(response => response.data as CreateGameResponse);
    }

    async joinGame(data: JoinGame): Promise<JoinGameResponse> {        
        return axios.post(`${import.meta.env.PUBLIC_SERVER_URL}/jeux/joindre-jeu`, {
            pseudoJoueur: data.playerNickname,
            codeJeu: data.gameCode
        }).then(response => response.data as JoinGameResponse);
    }

    async getGameDetails(gameCode: number):Promise<Game>  {
        return axios.get(`${import.meta.env.PUBLIC_SERVER_URL}/jeux/${gameCode}/details`).then(response => response.data as Game);
    }
}