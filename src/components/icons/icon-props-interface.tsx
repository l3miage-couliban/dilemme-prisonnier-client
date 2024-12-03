import type { QRLEventHandlerMulti } from "@builder.io/qwik";

export interface IconProps {
    class?: string;
    height?: string;
    width?: string;
    onClick$?: QRLEventHandlerMulti<PointerEvent, any>
}