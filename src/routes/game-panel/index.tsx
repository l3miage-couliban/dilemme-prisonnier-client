import { $, component$, createContextId, Signal, useComputed$, useContextProvider, useSignal, useTask$, useVisibleTask$} from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import GameBoard from "~/components/game-board/game-board";
import { GameService } from "~/services/game.service";
import { RoundService } from "~/services/round.service";
import { Game } from "~/types/game.type";
import { RoundDetailsWithShots } from "~/types/round-details-with-shots.type";

const gameService = new GameService();
const roundService = new RoundService();

export const useGameDetails = routeLoader$(async (requestEvent) => {
  const gameCode = requestEvent.query.get('gameCode') as string;
  const gameDetails = await gameService.getGameDetails(+gameCode); 

  const endedRounds = await Promise.all(gameDetails.parties.filter(p => p.statut === "TERMINE")
    .map(p => roundService.getRoundDetails(p.id))) as RoundDetailsWithShots[];
  
  return {
    gameDetails,
    endedRounds
  };
});

export const GameDetailsContextId = createContextId<Signal<Game>>('gameDetails');
export const EndedRoundsContextId = createContextId<Signal<RoundDetailsWithShots[]>>('endedRounds');

export default component$(() => {
  const gameDetails = useSignal(useGameDetails().value.gameDetails);
  const endedRounds = useSignal(useGameDetails().value.endedRounds);

  useContextProvider(GameDetailsContextId, gameDetails);
  useContextProvider(EndedRoundsContextId, endedRounds);

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
