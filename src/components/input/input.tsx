import { component$ } from "@builder.io/qwik";
import type { Signal } from "@builder.io/qwik";

interface InputProps {
    label?: string;
    type?: string;
    value: Signal<string | number>;
}

export default component$<InputProps>((props) => {
    return (
        <div class="flex flex-col m-2">
            <label for="input" class="text-base">{ props.label }</label>
            <input
                id="input"
                type={props.type || "text"}
                placeholder="Saisir ici ..."
                class="border-2 border-gray-400 w-full p-2 focus:outline-none focus:border-indigo-500"
                value={props.value?.value}
                onInput$={(_, el) => (props.value.value = el.value)} />
        </div>
    );
});