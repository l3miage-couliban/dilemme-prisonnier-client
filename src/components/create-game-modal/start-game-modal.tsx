import { $, component$, useContext, useSignal } from "@builder.io/qwik";
import { Modal } from '@qwik-ui/headless';
import Input from "../input/input";
import { CreateGameContextId, prograssBarStateId } from "~/routes";


export default component$(() => {
    const playerNickname = useSignal("");
    const partiesNumber = useSignal(0);

    const createGameSignal = useContext(CreateGameContextId);
    const prograssBarState = useContext(prograssBarStateId);

    const submit = $(() => {
        createGameSignal.value = { playerNickname: playerNickname.value, partiesNumber: partiesNumber.value };
        playerNickname.value = "";
        partiesNumber.value = 0;
        prograssBarState.value = true;
    });

    const clean = $(() => {
        playerNickname.value = "";
        partiesNumber.value = 0;
    });

    return (
        <Modal.Root>
            <Modal.Trigger class="modal-trigger mx-3 border rounded bg-slate-100 px-4 py-2 shadow-xl">Démarrer un jeu</Modal.Trigger>
            <Modal.Panel class="modal-panel w-96 rounded-md p-6 font-sans antialiased">
                <Modal.Title class="text-3xl font-extrabold mb-4">Démarrer un jeu</Modal.Title>
                <Input label="Pseudo du joueur" value={playerNickname} />
                <Input label="Nombre de parties" type="number" value={partiesNumber} />
                <footer class="mt-6">
                    <Modal.Close onClick$={clean} class="modal-close mx-2 p-2 border rounded bg-slate-50">Annuler</Modal.Close>
                    <Modal.Close onClick$={submit} class="modal-close mx-2 p-2 border rounded bg-indigo-500 text-white">Valider</Modal.Close>
                </footer>
            </Modal.Panel>
        </Modal.Root>
    );
})