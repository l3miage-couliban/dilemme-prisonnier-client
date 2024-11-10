import { component$, useComputed$, useContext, useSignal, useStylesScoped$, useVisibleTask$ } from "@builder.io/qwik";
import styles from "./game-board.css?inline";
import { Player } from "~/types/player.type";
import PlayerBoard from "../player-board/player-board";
import { EndedRoundsContextId, GameDetailsContextId } from "~/routes/game-panel";
import RoundResult from "../round-result/round-result";

export default component$(() => {
    useStylesScoped$(styles);

    const gameDetails = useContext(GameDetailsContextId);
    const endedRounds = useContext(EndedRoundsContextId);

    const totalRoundNumber = gameDetails.value.nombreParties;
    const currendRoundOrder = useComputed$(() => gameDetails.value.parties.find(partie => partie.statut === "EN_COURS")?.ordre);

    const player1 = useSignal<Player>(undefined);
    const player2 = useSignal<Player>(undefined);

    useVisibleTask$(() => {
        const players = gameDetails.value.joueurs;
    
        const localPlayer1 = JSON.parse(localStorage.getItem("joueur1") ?? "null") as Player;
        const localPlayer2 = JSON.parse(localStorage.getItem("joueur2") ?? "null") as Player;

        player1.value = players.find(p => p?.id === localPlayer1?.id) ?? players.find(p => p?.id !== localPlayer2?.id);
        player2.value = players.find(p => p?.id === localPlayer2?.id) ?? players.find(p => p?.id !== localPlayer1 ?.id);
    
      }, { strategy: 'document-ready' });

    return (
        <div class="flex flex-col items-center bg-sky-900 h-screen text-white pt-6">
            <div class="title text-orange-400">
                {gameDetails.value.statut === "EN_ATTENTE" && <div class="game-pending  text-center w-fit">EN ATTENTE DU SECOND JOUEUR</div>}
                {gameDetails.value.statut === "EN_COURS" && <div class="game-running text-center w-fit">Partie {currendRoundOrder}/{totalRoundNumber}</div>}
                {gameDetails.value.statut === "TERMINE" && <div class="game-ended text-center w-fit">VAINQUEUR : </div>}
            </div>

            <div class="flex flex-row w-full justify-around items-center mt-16">
                <PlayerBoard player={player1} order={1} gameState={gameDetails.value.statut} />
                <div class="vs text-yellow-400">VS</div>
                <PlayerBoard player={player2} order={2} gameState={gameDetails.value.statut} />
            </div>
            <div class="flex flex-col items-center mt-5">
                <div class="text-xl font-bold">Resultats</div>
                {
                    endedRounds.value.map(round => (
                        <RoundResult key={round.id} round={round} player1={player1.value} player2={player2.value} />
                    ))
                }
            </div>
        </div>
    );
});