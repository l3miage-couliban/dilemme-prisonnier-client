import { $, component$, useContext, useSignal } from "@builder.io/qwik";
import type { Signal } from "@builder.io/qwik";
import { CheckIcon } from "../icons/check-icon";
import { CloseIcon } from "../icons/close-icon";
import { quitGameContextId } from "~/routes/game-panel";
import type { Player } from "~/types/player.type";

export interface StrategiesSelectProps {
    isSelectOfStrategiesDisplayed: Signal<boolean>;
    player: Signal<Player>;
}

export const strategies = ["DONNANT_DONNANT", "TOUJOURS_COOPERER", "TOUJOURS_TRAHIR", "RANCUNIER", "ALEATOIRE"];


const StrategiesSelect = component$<StrategiesSelectProps>((props) => {

    const strategySelected = useSignal(undefined);
    const quitGameRequest = useContext(quitGameContextId);

    const quitGame = $(() => {
        quitGameRequest.value = {playerId: props.player.value?.id, strategy: strategySelected.value}
        props.isSelectOfStrategiesDisplayed.value = false;
        strategySelected.value = undefined;
    });
    
    return (
        <div class="flex flex-row mt-2">
            <div class="flex-grow">
                <select class="w-full p-1 text-black rounded capitalize" onChange$={(event: any) => strategySelected.value = event.target.value}>
                    <option disabled>Choisir une stratégie</option>
                    {
                        strategies.map((strategy, index) =>
                            <option key={index} value={strategy} class="capitalize">{strategy.replace("_", " ").toLowerCase()}</option>)
                    }
                </select>
            </div>
            <CheckIcon height="24" width="24" class="mx-2 p-1 bg-white rounded cursor-pointer" onClick$={() => quitGame()} />
            <CloseIcon height="24" width="24" class="p-1 bg-white rounded cursor-pointer" onClick$={() => props.isSelectOfStrategiesDisplayed.value = false} />
        </div>
    );
});

export default StrategiesSelect;