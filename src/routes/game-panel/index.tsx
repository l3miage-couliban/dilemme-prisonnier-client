import { component$, createContextId, useContextProvider, useSignal, useComputed$, useTask$, useVisibleTask$} from "@builder.io/qwik";
import { routeAction$, routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import type { Signal } from "@builder.io/qwik";
import GameBoard from "~/components/game-board/game-board";
import { GameService } from "~/services/game.service";
import { PlayerService } from "~/services/player.service";
import { RoundService } from "~/services/round.service";
import type { Game } from "~/types/game.type";
import type { PlayShotRequest } from "~/types/play-shot-request.type";
import type { Player } from "~/types/player.type";
import type { QuitGameRequest } from "~/types/quit-game-request.type";
import type { RoundDetailsWithShots } from "~/types/round-details-with-shots.type";

const gameService = new GameService();
const roundService = new RoundService();
const playerService = new PlayerService();

export const useGameDetails = routeLoader$(async (requestEvent) => {
  const gameCode = requestEvent.query.get('gameCode') as string;
  const gameDetails = await gameService.getGameDetails(+gameCode);

  const roundsDetails = await Promise.all(gameDetails.parties.map(p => roundService.getRoundDetails(p.id))) as RoundDetailsWithShots[];
  
  return {
    gameDetails,
    roundsDetails
  };
});

export const usePlayShot = routeAction$(async (data) => {
  const response = await roundService.playShot(data.gameId as number, data.request as PlayShotRequest);
  return {
    success: response.success,
    data: response.data
  };
});

export const useGetGameDetails = routeAction$(async (data) => {
  const gameDetails = await gameService.getGameDetails(data.gameId as number);
  const roundsDetails = await Promise.all(gameDetails.parties.map(p => roundService.getRoundDetails(p.id))) as RoundDetailsWithShots[];
  
  return {
    gameDetails,
    roundsDetails
  };
});

export const useQuitGame = routeAction$(async (data) => {
  const response = await playerService.quitGame(data);
  return {
    success: response.success,
    data: response.data
  };
});

export const GameDetailsContextId = createContextId<Signal<Game>>('gameDetails');
export const roundsDetailsContextId = createContextId<Signal<RoundDetailsWithShots[]>>('endedRounds');
export const playShotContextId = createContextId<Signal<PlayShotRequest>>('playShot');
export const quitGameContextId = createContextId<Signal<QuitGameRequest>>('quitGame');
export const currentPlayerContextId = createContextId<Signal<Player>>('currentPlayer');
export const progressShotContextId = createContextId<Signal<boolean>>('progressShot');

export default component$(() => {
  const gameDetails = useSignal(useGameDetails().value.gameDetails);
  const roundsDetails = useSignal(useGameDetails().value.roundsDetails);
  const gameId = useComputed$(() => gameDetails.value.id);

  const playShotRequest = useSignal<PlayShotRequest>({playerId: undefined, shot: undefined});
  const quitGameRequest = useSignal<QuitGameRequest>({playerId: undefined, strategy: undefined});
  const currentPlayer = useSignal<Player>();
  const progressShot = useSignal(false);

  useContextProvider(GameDetailsContextId, gameDetails);
  useContextProvider(roundsDetailsContextId, roundsDetails);
  useContextProvider(playShotContextId, playShotRequest);
  useContextProvider(quitGameContextId, quitGameRequest);
  useContextProvider(currentPlayerContextId, currentPlayer);
  useContextProvider(progressShotContextId, progressShot);


  const usePlayShotAction = usePlayShot();
  const useQuitGameAction = useQuitGame();
  const useGetGameDetailsAction = useGetGameDetails();

  useTask$(({track}) => {
    const playShotRequestTracked = track(playShotRequest);
    const quitGameRequestTracked = track(quitGameRequest);
    
    if (playShotRequestTracked.playerId != undefined) {      
      usePlayShotAction.submit({gameId: gameDetails.value.id, request: playShotRequestTracked}).then();
      playShotRequest.value = {playerId: undefined, shot: undefined};
    }

    if (quitGameRequestTracked.playerId != undefined && quitGameRequestTracked.strategy != undefined) {      
      useQuitGameAction.submit({...quitGameRequestTracked}).then();
      quitGameRequest.value = {playerId: undefined, strategy: undefined};
    }
  });

  useVisibleTask$(({track}) => {
    const currentPlayerTracked = track(currentPlayer);
  
    if (currentPlayerTracked != undefined) {
      const eventSource = new EventSource(`${import.meta.env.PUBLIC_SERVER_URL}/jeux/${gameId}/joueurs/${currentPlayer.value?.id}/event`);
  
      eventSource.addEventListener("Id Jeu", (event) => {
        console.log("CONNEXION REUSSIE JEU: "+event.data);
      });
  
      eventSource.addEventListener("message", (event) => {
        console.log("Message reçu: "+event.data);
        progressShot.value = false;
        useGetGameDetailsAction.submit(({gameId: gameId})).then(response => {
          gameDetails.value = response.value.gameDetails;
          roundsDetails.value = response.value.roundsDetails;
        });
      });
    }
  })

  return (
      <div>
          <GameBoard />
      </div>
  );
});

export const head: DocumentHead = {
  title: "Dilemme Prisonnier",
  meta: [
    {
      name: "description",
      content: "Dilemme du prisonnier",
    },
  ],
};
