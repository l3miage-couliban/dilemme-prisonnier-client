import type { IconProps } from "./icon-props-interface";

export const CloseIcon = ((props: IconProps) => (
    <div class={props.class}>
        <svg xmlns="http://www.w3.org/2000/svg" 
            height={props.height} 
            viewBox="0 -960 960 960" 
            width={props.width} 
            fill="#5f6368"
            onClick$={props.onClick$}>
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
    </div>
));