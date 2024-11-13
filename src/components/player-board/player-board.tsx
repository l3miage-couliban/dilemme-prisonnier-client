import { $, component$, Signal, useContext, useSignal, } from "@builder.io/qwik";
import { Player } from "~/types/player.type";
import ImgJack from '/src/assets/jack.png?jsx';
import ImgWilliam from '/src/assets/william.png?jsx';
import { playShotContextId } from "~/routes/game-panel";
import StrategiesSelect from "../strategies-select/strategies-select";
import { ShotDetails } from "~/types/shot-details.type";


interface PlayerBoardProps {
    player: Signal<Player>;
    order: number;
    gameState: string;
    isPlayer1?: boolean;
    isPlayer2?: boolean;
    shot?: Signal<ShotDetails | undefined>;
}

const PlayerBoard = component$<PlayerBoardProps>((props) => {    

    const canDisplayButtons = props.isPlayer1 || props.isPlayer2;

    const playShotRequest = useContext(playShotContextId);

    const isSelectOfStrategiesDisplayed = useSignal(false);

    const playShot = $((shot: string) => {
        playShotRequest.value = {playerId: props.player.value?.id, shot};
    });

    return (
        <div class="flex flex-col items-center">
            <div class="mb-4 text-xl font-bold">Joueur {props.order}: {props.player.value?.nom}</div>
            {props.order === 1 && <ImgJack class="block w-32 h-32 rounded-full bg-white" />}
            {props.order === 2 && <ImgWilliam class="block w-32 h-32 rounded-full bg-white" />}

            {props.gameState == "EN_COURS" && canDisplayButtons && !props.shot?.value && !props.player.value?.abandon &&
                <div class="mt-4 text-sm">
                    <button class="mx-1 border rounded bg-slate-100 px-1 py-2 text-black" onClick$={() => playShot("COOPERER")}>Cooperer</button>
                    <button class="mx-1 border rounded bg-slate-100 px-1 py-2 text-black" onClick$={() => playShot("TRAHIR")}>Trahir</button>
                    <button class="mx-1 border rounded bg-slate-100 px-1 py-2 text-black" onClick$={() => isSelectOfStrategiesDisplayed.value = true}>Abandonner</button>
                    {isSelectOfStrategiesDisplayed.value && <StrategiesSelect isSelectOfStrategiesDisplayed={isSelectOfStrategiesDisplayed} player={props.player} /> }
                </div>
            }

            {props.shot?.value &&
                <div class="mt-6 text-xl font-bold"> Déjà joué !!!</div>
            }

            {props.player.value?.abandon &&
                <div class="mt-6 text-xl font-bold">Abandonné</div>
            }
        </div>
    );
});

export default PlayerBoard;