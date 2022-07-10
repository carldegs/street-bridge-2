import { Icon, IconProps } from '@chakra-ui/react';
import { IconProps as PhosphorIconProps } from 'phosphor-react';

interface Props extends Omit<IconProps, 'fontWeight'> {
  icon: React.ForwardRefExoticComponent<
    PhosphorIconProps & React.RefAttributes<SVGSVGElement>
  >;
  fontWeight?: PhosphorIconProps['weight'];
}

const PhosphorIcon: React.FC<Props> = ({
  icon,
  fontWeight = 'regular',
  ...props
}) => <Icon as={icon} weight={fontWeight} {...props} />;

export default PhosphorIcon;
