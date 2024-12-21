import { FC } from 'react';
import { useGlyphKit } from './GlyphKitProvider';

interface IconProps {
  name: string;
  size?: number | string;
  color?: string;
  className?: string;
}

export const Icon: FC<IconProps> = ({
  name,
  size = 24,
  color = 'currentColor',
  className,
}) => {
  const { icons, isLoading, error } = useGlyphKit();
  
  if (isLoading) return null;
  if (error) return null;

  const icon = icons.find(i => i.name === name);
  if (!icon) return null;

  return (
    <svg
      width={size}
      height={size}
      fill={color}
      className={className}
      viewBox="0 0 24 24"
    >
      <use href={`${icon.path}#${icon.id}`} />
    </svg>
  );
}; 