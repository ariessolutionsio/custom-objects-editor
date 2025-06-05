import React, { FC } from 'react';

interface SvgIconProps {
  iconName: string;
  alt?: string;
  className?: string;
  width?: string | number;
  height?: string | number;
}

const SvgIcon: FC<SvgIconProps> = ({ iconName, alt, className, width = 20, height = 20 }) => {
  const iconPath = '/assets/icons/' + iconName + '.svg';

  return (
    <img
      src={iconPath}
      alt={alt || iconName}
      className={className}
      width={width}
      height={height}
      style={{ verticalAlign: 'middle' }}
    />
  );
};

export default SvgIcon; 