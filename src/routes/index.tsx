import { component$, createContextId, Signal, useContextProvider, useSignal, useTask$ } from "@builder.io/qwik";
import { routeAction$, useNavigate, type DocumentHead } from "@builder.io/qwik-city";
import { isBrowser } from "@builder.io/qwik/build";
import Home from "~/components/home/home";
import { GameService } from "~/services/game.service";
import { CreateGame } from "~/types/create-game.type";
import { JoinGame } from "~/types/join-game.type";

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

export default component$(() => {
  const createGame = useSignal({ playerNickname: "", partiesNumber: 0 });
  const joinGame = useSignal({ playerNickname: "", gameCode: 0 });

  useContextProvider(CreateGameContextId, createGame);
  useContextProvider(JoinGameContextId, joinGame);

  const nav = useNavigate();

  const createGameAction = useCreateGame();
  const joinGameAction = useJoinGame();

  useTask$(({ track }) => {
    const createGameTracked = track(createGame);

    if (createGameTracked.partiesNumber !== 0) {
      createGameAction.submit({ ...createGameTracked })
        .then(response => {
          if (isBrowser) {
            localStorage.setItem("joueur1", JSON.stringify(response.value.data.joueurCree));
          }
          nav('/game-panel?gameCode=' + response.value.data.id)
        });
    }
  });

  useTask$(({ track }) => {
    const joinGameTracked = track(joinGame);

    if (joinGameTracked.playerNickname != "") {
      joinGameAction.submit({ ...joinGameTracked })
        .then(response => {
          if (isBrowser) {
            localStorage.setItem("joueur2", JSON.stringify(response.value.data.joueurCree));
          }
          nav('/game-panel?gameCode=' + response.value.data.id)
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
