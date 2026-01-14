export type PageKey =
  | 'about'
  | 'connect'
  | 'gallery'
  | 'alumni-day'
  | 'events'
  | 'reunion'
  | 'faq'
  | 'contact'
  | 'member'
  | 'home';

export interface PageSection {
  element: HTMLElement | null;
  title: string;
}

export interface NavigationConfig {
  pageKey: PageKey;
  heroTitle: string;
  sectionId: string;
}

