import { FC } from 'react';
export interface IconProps {
    name: string;
    size?: number | string;
    color?: string;
    className?: string;
    svgDirectory?: string;
    iconPrefix?: string;
    onError?: (error: Error) => void;
    onLoad?: () => void;
}
export declare const Icon: FC<IconProps>;
//# sourceMappingURL=Icon.d.ts.map