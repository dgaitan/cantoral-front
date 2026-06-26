import APP_URLS from "@/lib/constants";
import type { FooterColumnData, FooterLink, FooterSocial } from "@/types/footer";

// Liturgical moments. Exact tag_id needs runtime category data, so we link by
// search term to keep the footer a zero-JS Server Component.
const LITURGY_MOMENTS = ["Entrada", "Ofertorio", "Comunión", "Salida", "Adoración"];

export const FOOTER_COLUMNS: FooterColumnData[] = [
  {
    title: "Explorar",
    links: LITURGY_MOMENTS.map((moment) => ({
      label: moment,
      href: `${APP_URLS.EXPLORER}?q=${encodeURIComponent(moment)}`,
    })),
  },
  {
    title: "Recursos",
    links: [
      { label: "Cancioneros", href: APP_URLS.SONGS },
      { label: "Listas / Setlists", href: APP_URLS.LISTAS },
      { label: "Cómo proyectar", href: "#" },
      { label: "Acordes y tonos", href: "#" },
    ],
  },
  {
    title: "Comunidad",
    links: [
      { label: "Sugerir una canción", href: "#" },
      { label: "Reportar un error", href: "#" },
      { label: "Contacto", href: "#" },
    ],
  },
  {
    title: "Cuenta",
    links: [
      { label: "Ingresar", href: APP_URLS.LOGIN },
      { label: "Crear cuenta", href: APP_URLS.REGISTER },
      { label: "Mis favoritos", href: APP_URLS.FAVORITES },
    ],
  },
];

export const FOOTER_SOCIALS: FooterSocial[] = [
  { label: "IG", name: "Instagram", href: "#" },
  { label: "YT", name: "YouTube", href: "#" },
  { label: "FB", name: "Facebook", href: "#" },
];

export const FOOTER_LEGAL: FooterLink[] = [
  { label: "Términos", href: "#" },
  { label: "Privacidad", href: "#" },
  { label: "Acerca de", href: "#" },
];
