import { $, component$, createContextId, Signal, useComputed$, useContextProvider, useSignal, useTask$, useVisibleTask$} from "@builder.io/qwik";
import { routeAction$, routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import GameBoard from "~/components/game-board/game-board";
import { GameService } from "~/services/game.service";
import { PlayerService } from "~/services/player.service";
import { RoundService } from "~/services/round.service";
import { Game } from "~/types/game.type";
import { PlayShotRequest } from "~/types/play-shot-request.type";
import { QuitGameRequest } from "~/types/quit-game-request.type";
import { RoundDetailsWithShots } from "~/types/round-details-with-shots.type";

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

export const useQuitGame = routeAction$(async (data) => {
  console.log("action: ", data);
  
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

export default component$(() => {
  const gameDetails = useSignal(useGameDetails().value.gameDetails);
  const roundsDetails = useSignal(useGameDetails().value.roundsDetails);
  const playShotRequest = useSignal<PlayShotRequest>({playerId: undefined, shot: undefined});
  const quitGameRequest = useSignal<QuitGameRequest>({playerId: undefined, strategy: undefined});

  useContextProvider(GameDetailsContextId, gameDetails);
  useContextProvider(roundsDetailsContextId, roundsDetails);
  useContextProvider(playShotContextId, playShotRequest);
  useContextProvider(quitGameContextId, quitGameRequest);

  const usePlayShotAction = usePlayShot();
  const useQuitGameAction = useQuitGame();

  useTask$(({track}) => {
    const playShotRequestTracked = track(playShotRequest);
    const quitGameRequestTracked = track(quitGameRequest);
    
    if (playShotRequestTracked.playerId != undefined) {
      usePlayShotAction.submit({gameId: gameDetails.value.id, request: playShotRequestTracked}).then();
    }

    if (quitGameRequestTracked.playerId != undefined && quitGameRequestTracked.strategy != undefined) {      
      useQuitGameAction.submit({...quitGameRequestTracked}).then();
    }
  });

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
