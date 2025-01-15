import { $, component$, useComputed$, useContext, useSignal, useStylesScoped$, useVisibleTask$ } from "@builder.io/qwik";
import styles from "./game-board.css?inline";
import type { Player } from "~/types/player.type";
import PlayerBoard from "../player-board/player-board";
import { roundsDetailsContextId, GameDetailsContextId, currentPlayerContextId } from "~/routes/game-panel";
import RoundResult from "../round-result/round-result";

export default component$(() => {
    useStylesScoped$(styles);

    const gameDetails = useContext(GameDetailsContextId);
    const roundsDetails = useContext(roundsDetailsContextId);
    const currentPlayer = useContext(currentPlayerContextId);

    const totalRoundNumber = useComputed$(() => gameDetails.value.nombreParties);
    const currendRound = useComputed$(() => roundsDetails.value.find(round => round.statut === "EN_COURS"));
    const endedRounds = useComputed$(() => roundsDetails.value
        .filter(round => round.statut === "TERMINE")
        .sort((r1, r2) => r1.ordre - r2.ordre)
    );

    const players = useComputed$(() => gameDetails.value.joueurs);

    const localPlayer1 = useSignal<Player>();
    const localPlayer2 = useSignal<Player>();

    const isPlayer1 = useComputed$(() => localPlayer1.value != null && true);
    const isPlayer2 = useComputed$(() => localPlayer2.value != null && true);

    const player1 = useComputed$(() => players.value.find(p => p?.id === localPlayer1.value?.id) ?? players.value.find(p => p?.id !== localPlayer2.value?.id));
    const player2 = useComputed$(() => players.value.find(p => p?.id === localPlayer2.value?.id) ?? players.value.find(p => p?.id !== localPlayer1.value?.id));

    const shotPlayer1 = useComputed$(() => currendRound.value?.partiesJoueurs.find(shot => shot.joueur?.id === player1.value?.id));
    const shotPlayer2 = useComputed$(() => currendRound.value?.partiesJoueurs.find(shot => shot.joueur?.id === player2.value?.id));

    const countScorePlayer = $((player: Player) => endedRounds.value.map(
        round => round.partiesJoueurs.find(
            shot => shot.joueur?.id === player!.id
        )
    ).reduce((acc, shot) => acc + (shot?.score ?? 0), 0));

    const totalScorePlayer1 = useComputed$(() => countScorePlayer(player1.value));
    const totalScorePlayer2 = useComputed$(() => countScorePlayer(player2.value));

    const winnerName = useComputed$(() => totalScorePlayer1.value > totalScorePlayer2.value ? (player1.value?.nom) : (player2.value?.nom));
    const areScoresEquals = useComputed$(() => totalScorePlayer1.value === totalScorePlayer2.value);

    useVisibleTask$(() => {
        localPlayer1.value = JSON.parse(localStorage.getItem("joueur1") ?? "null") as Player;
        localPlayer2.value = JSON.parse(localStorage.getItem("joueur2") ?? "null") as Player;

        currentPlayer.value = localPlayer1.value ?? localPlayer2.value;
    }, { strategy: 'document-ready' });

    return (
        <div class="flex flex-col items-center bg-sky-900 h-screen text-white pt-6">
            <div class="title">
                {gameDetails.value.statut === "EN_ATTENTE" && <div class="game-pending text-orange-400 text-center w-fit">EN ATTENTE DU SECOND JOUEUR</div>}
                {gameDetails.value.statut === "EN_ATTENTE" && <div class="text-center w-full text-center text-xl">CODE DU JEU : {gameDetails.value.id}</div>}
                {gameDetails.value.statut === "EN_COURS" && <div class="game-running text-orange-400 text-center w-fit">Partie {currendRound.value?.ordre}/{totalRoundNumber}</div>}
                {gameDetails.value.statut === "TERMINE" && !areScoresEquals.value && <div class="game-ended text-orange-400 text-center w-fit">VAINQUEUR : {winnerName.value} </div>}
                {gameDetails.value.statut === "TERMINE" && areScoresEquals.value && <div class="game-ended text-orange-400 text-center w-fit"> MATCH NUL </div>}
            </div>

            <div class="flex flex-row w-full justify-around items-center mt-16">
                <PlayerBoard player={player1} order={1} gameState={gameDetails.value.statut} isPlayer1={isPlayer1.value} shot={shotPlayer1} />
                <div class="flex flex-row items-center">
                    <div class="text-extrabold text-4xl">{totalScorePlayer1.value}</div>
                    <div class="vs text-yellow-400 mx-20">VS</div>
                    <div class="text-extrabold text-4xl">{totalScorePlayer2.value}</div>
                </div>
                <PlayerBoard player={player2} order={2} gameState={gameDetails.value.statut} isPlayer2={isPlayer2.value} shot={shotPlayer2} />
            </div>
            <div class="flex flex-col items-center mt-5">
                <div class="text-2xl font-bold mb-4">Resultats</div>
                {
                    endedRounds.value.map(round => (
                        <RoundResult key={round.id} round={round} player1={player1.value} player2={player2.value} />
                    ))
                }
            </div>
        </div>
    );
});