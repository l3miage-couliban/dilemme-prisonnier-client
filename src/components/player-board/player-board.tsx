import { component$, Signal } from "@builder.io/qwik";
import { Player } from "~/types/player.type";
import ImgJack from '../../../public/jack.png?jsx';
import ImgWilliam from '../../../public/william.png?jsx';


interface PlayerBoardProps {
    player: Signal<Player>;
    order: number;
    gameState: string;
}

const PlayerBoard = component$<PlayerBoardProps>((props) => {
    return (
        <div class="flex flex-col items-center">
            <div class="mb-4 text-xl font-bold">Joueur {props.order}: {props.player.value?.nom}</div>
            {props.order === 1 && <ImgJack class="block w-32 h-32 rounded-full bg-white" />}
            {props.order === 2 && <ImgWilliam class="block w-32 h-32 rounded-full bg-white" />}

            {props.gameState != "TERMINE" && 
                <div class="mt-4">
                    <button class="mx-2 border rounded bg-slate-100 px-2 py-2 text-black">Cooperer</button>
                    <button class="mx-2 border rounded bg-slate-100 px-2 py-2 text-black">Trahir</button>
                    <button class="mx-2 border rounded bg-slate-100 px-2 py-2 text-black">Abandonner</button>
                </div>
            }
            
        </div>
    );
});

export default PlayerBoard;