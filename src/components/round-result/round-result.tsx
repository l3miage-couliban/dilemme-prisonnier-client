import { component$ } from "@builder.io/qwik";
import type { Player } from "~/types/player.type";
import type { RoundDetailsWithShots } from "~/types/round-details-with-shots.type";

interface RoundResultProps {
    round: RoundDetailsWithShots;
    player1: Player;
    player2: Player;
}

const RoundResult = component$<RoundResultProps>((props) => {
    const round = props.round;
    const shotPlayer1 = round.partiesJoueurs.find(s => s.joueur?.id === props.player1?.id);
    const shotPlayer2 = round.partiesJoueurs.find(s => s.joueur?.id === props.player2?.id);

    return (
        <div class="flex flex-row w-96 justify-between" key={round.id}>
            <div class="flex flex-row justify-around w-2/5">
                <span class="font-semibold">{shotPlayer1?.coup}</span>
                <span>{shotPlayer1?.score}</span>
            </div>
            <div class="font-bold text-base text-orange-400">Partie {round.ordre}</div>
            <div class="flex flex-row justify-around w-2/5">
                <span>{shotPlayer2?.score}</span>
                <span class="font-semibold">{shotPlayer2?.coup}</span>
            </div>
        </div>
    );
})

export default RoundResult;