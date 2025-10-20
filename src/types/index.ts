export type NavLink = {
  id: number;
  href?: string | null;
  label: string;
};

export type UserNavLink = NavLink & {
  icon: string;
};

export type TravelHubBucketCardProps = {
  id: number;
  imageSrc: string;
  title: string;
  location?: string;
  noOfItems?: number;
};

export type CardProps = {
  id: number;
  imageSrc: string;
  title: string;
  rating?: string;
  location?: string;
 
  currency?: string;
  discount?: string;
  showBadge?: boolean;
  href?: string;
  category?: string;
  policy?: boolean | null;
  originalPrice?: string;
  farePrice?: string;
};

export type CityCardProps = {
  id: number;
  imageSrc: string;
  title: string;
  href?: string;
};

export type BenefitCardProps = {
  id: number;
  imageSrc: string;
  title: string;
  description: string;
  href?: string;
};

export type AssociatedWithLogo = {
  id: number;
  src: string;
  href?: string;
  name?: string;
};

export type DownloadAppImage = {
  id: number;
  src: string;
  href?: string;
};

export type FooterLink = {
  id: number;
  href: string;
  label: string;
};

export type FooterSocialMediaLink = {
  id: number;
  iconSrc: string;
  href: string;
  label: string;
};

export type PaymentMethod = {
  id: number;
  src: string;
  label: string;
};

export type FooterLegalLink = {
  id: number;
  href: string;
  label: string;
};

export type GalleryImage = {
  id: number;
  src: string;
  alt: string;
};

export type EmptyStateProps = {
  title: string;
  description: string;
  image: string;
  buttonText: string;
  showButton?: boolean;
};

export type SettingsLink = {
  id: number;
  href: string;
  label: string;
};
export type SupportAndHelpCenterLink = SettingsLink;

export interface DataWithCount<T> {
  request_id?: string;
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface CountryCode {
  name: string;
  code: string;
  dial_code: string;
  flag: string;
}

export interface ContentItem {
  id: string | number;
  [key: string]: any;
}
