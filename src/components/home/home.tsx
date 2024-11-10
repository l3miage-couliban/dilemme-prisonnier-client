import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./home.css?inline"
import StartGameModal from "../create-game-modal/start-game-modal";
import JoinGameModal from "../join-game-modal/join-game-modal";


export default component$(() => {
    useStylesScoped$(styles);

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
        </div>
    );
});