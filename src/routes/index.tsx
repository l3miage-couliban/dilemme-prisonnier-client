import { component$, createContextId, useContextProvider, useSignal, useTask$ } from "@builder.io/qwik";
import { routeAction$, useNavigate, type DocumentHead } from "@builder.io/qwik-city";
import type { Signal } from "@builder.io/qwik";
import { isBrowser } from "@builder.io/qwik/build";
import Home from "~/components/home/home";
import { GameService } from "~/services/game.service";
import type { CreateGame } from "~/types/create-game.type";
import type { JoinGame } from "~/types/join-game.type";

const gameService = new GameService();

export const useCreateGame = routeAction$(async (data) => {
  const response = await gameService.createGame({
    playerNickname: data.playerNickname as string,
    partiesNumber: data.partiesNumber as number
  });

  return {
    success: true,
    data: response
  };
})

export const useJoinGame = routeAction$(async (data) => {
  const response = await gameService.joinGame({
    playerNickname: data.playerNickname as string,
    gameCode: data.gameCode as number
  });

  return {
    success: true,
    data: response
  };
})

export const CreateGameContextId = createContextId<Signal<CreateGame>>('createGame');
export const JoinGameContextId = createContextId<Signal<JoinGame>>('joinGame');
export const prograssBarStateId = createContextId<Signal<boolean | null>>('prograssBarState');

export default component$(() => {
  const createGame = useSignal({ playerNickname: "", partiesNumber: 0 });
  const joinGame = useSignal({ playerNickname: "", gameCode: 0 });
  const prograssBarState = useSignal(false);

  useContextProvider(CreateGameContextId, createGame);
  useContextProvider(JoinGameContextId, joinGame);
  useContextProvider(prograssBarStateId, prograssBarState);

  const nav = useNavigate();

  const createGameAction = useCreateGame();
  const joinGameAction = useJoinGame();

  useTask$(({ track }) => {
    const createGameTracked = track(createGame);

    if (createGameTracked.partiesNumber !== 0) {
      createGameAction.submit({ ...createGameTracked })
        .then(response => {
          if (isBrowser) {
            localStorage.clear();
            localStorage.setItem("joueur1", JSON.stringify(response.value.data.joueurCree));
          }
          nav('/game-panel?gameCode=' + response.value.data.id);
          prograssBarState.value = false;
        });
    }
  });

  useTask$(({ track }) => {
    const joinGameTracked = track(joinGame);

    if (joinGameTracked.playerNickname != "") {
      joinGameAction.submit({ ...joinGameTracked })
        .then(response => {
          if (isBrowser) {
            localStorage.clear();
            localStorage.setItem("joueur2", JSON.stringify(response.value.data.joueurCree));
          }
          nav('/game-panel?gameCode=' + response.value.data.id);
          prograssBarState.value = false;
        });
    }
  });

  return (
    <>
      <Home />
    </>
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
