export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumnData {
  title: string;
  links: FooterLink[];
}

export interface FooterColumnProps {
  column: FooterColumnData;
}

export interface FooterSocial {
  /** Short badge text, e.g. "IG". */
  label: string;
  /** Accessible name, e.g. "Instagram". */
  name: string;
  href: string;
}
