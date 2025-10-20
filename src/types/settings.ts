import { IconName } from '@/configs/settings-menu';

export interface MenuItemProps {
  iconName?: IconName;
  label: string;
  href: string;
}

export interface MenuSectionProps {
  title: string;
  items: MenuItemProps[];
}
