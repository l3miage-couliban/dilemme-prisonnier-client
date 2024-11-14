import { component$, useContext, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./home.css?inline"
import StartGameModal from "../create-game-modal/start-game-modal";
import JoinGameModal from "../join-game-modal/join-game-modal";
import { prograssBarStateId } from "~/routes";


export default component$(() => {
    useStylesScoped$(styles);

    const prograssBarState = useContext(prograssBarStateId);

    return (
        <div class="flex flex-col justify-center content-center bg-sky-900 h-screen">
            <div class="text">
                <span class="orange">DILEMME</span> <br />
                <span class="du">DU</span> <br />
                <span class="rayures">PRISONNIER</span> <br />
            </div>
            <div class="flex flex-row mt-10 justify-center">
                <StartGameModal />
                <JoinGameModal />
            </div>
            {prograssBarState.value &&
                <div class="flex flex-row mt-10 justify-center">
                    <div class="m-auto w-72">
                        <div class="h-4 w-full bg-gray-400 overflow-hidden">
                            <div class="progress-bar-value bg-white h-full w-full"></div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
});