export interface EuropeanCountry {
  id: string;      // ISO 3166-1 alpha-2 code
  name: string;    // Name in French
  nativeName: string;
  emoji: string;
}

export const EUROPEAN_COUNTRIES: EuropeanCountry[] = [
  { id: 'AL', name: 'Albanie', nativeName: 'Shqipëria', emoji: '🇦🇱' },
  { id: 'DE', name: 'Allemagne', nativeName: 'Deutschland', emoji: '🇩🇪' },
  { id: 'AD', name: 'Andorre', nativeName: 'Andorra', emoji: '🇦🇩' },
  { id: 'AT', name: 'Autriche', nativeName: 'Österreich', emoji: '🇦🇹' },
  { id: 'BE', name: 'Belgique', nativeName: 'België / Belgique', emoji: '🇧🇪' },
  { id: 'BY', name: 'Biélorussie', nativeName: 'Bielorussia', emoji: '🇧🇾' },
  { id: 'BA', name: 'Bosnie-Herzégovine', nativeName: 'Bosna i Hercegovina', emoji: '🇧🇦' },
  { id: 'BG', name: 'Bulgarie', nativeName: 'Bălgarija', emoji: '🇧🇬' },
  { id: 'CY', name: 'Chypre', nativeName: 'Kýpros', emoji: '🇨🇾' },
  { id: 'HR', name: 'Croatie', nativeName: 'Hrvatska', emoji: '🇭🇷' },
  { id: 'DK', name: 'Danemark', nativeName: 'Danmark', emoji: '🇩🇰' },
  { id: 'ES', name: 'Espagne', nativeName: 'España', emoji: '🇪🇸' },
  { id: 'EE', name: 'Estonie', nativeName: 'Eesti', emoji: '🇪🇪' },
  { id: 'FI', name: 'Finlande', nativeName: 'Suomi', emoji: '🇫🇮' },
  // France is handled separately but can be included for completeness
  { id: 'FR', name: 'France', nativeName: 'France', emoji: '🇫🇷' },
  { id: 'GR', name: 'Grèce', nativeName: 'Elláda', emoji: '🇬🇷' },
  { id: 'HU', name: 'Hongrie', nativeName: 'Magyarország', emoji: '🇭🇺' },
  { id: 'IE', name: 'Irlande', nativeName: 'Éire', emoji: '🇮🇪' },
  { id: 'IS', name: 'Islande', nativeName: 'Ísland', emoji: '🇮🇸' },
  { id: 'IT', name: 'Italie', nativeName: 'Italia', emoji: '🇮🇹' },
  { id: 'XK', name: 'Kosovo', nativeName: 'Kosovë', emoji: '🇽🇰' },
  { id: 'LV', name: 'Lettonie', nativeName: 'Latvija', emoji: '🇱🇻' },
  { id: 'LI', name: 'Liechtenstein', nativeName: 'Liechtenstein', emoji: '🇱🇮' },
  { id: 'LT', name: 'Lituanie', nativeName: 'Lietuva', emoji: '🇱🇹' },
  { id: 'LU', name: 'Luxembourg', nativeName: 'Lëtzebuerg', emoji: '🇱🇺' },
  { id: 'MK', name: 'Macédoine du Nord', nativeName: 'Severna Makedonija', emoji: '🇲🇰' },
  { id: 'MT', name: 'Malte', nativeName: 'Malta', emoji: '🇲🇹' },
  { id: 'MD', name: 'Moldavie', nativeName: 'Moldova', emoji: '🇲🇩' },
  { id: 'MC', name: 'Monaco', nativeName: 'Monaco', emoji: '🇲🇨' },
  { id: 'ME', name: 'Monténégro', nativeName: 'Crna Gora', emoji: '🇲🇪' },
  { id: 'NO', name: 'Norvège', nativeName: 'Norge', emoji: '🇳🇴' },
  { id: 'NL', name: 'Pays-Bas', nativeName: 'Nederland', emoji: '🇳🇱' },
  { id: 'PL', name: 'Pologne', nativeName: 'Polska', emoji: '🇵🇱' },
  { id: 'PT', name: 'Portugal', nativeName: 'Portugal', emoji: '🇵🇹' },
  { id: 'CZ', name: 'République Tchèque', nativeName: 'Česko', emoji: '🇨🇿' },
  { id: 'RO', name: 'Roumanie', nativeName: 'România', emoji: '🇷🇴' },
  { id: 'GB', name: 'Royaume-Uni', nativeName: 'United Kingdom', emoji: '🇬🇧' },
  { id: 'RU', name: 'Russie', nativeName: 'Rossiya', emoji: '🇷🇺' },
  { id: 'SM', name: 'Saint-Marin', nativeName: 'San Marino', emoji: '🇸🇲' },
  { id: 'RS', name: 'Serbie', nativeName: 'Srbija', emoji: '🇷🇸' },
  { id: 'SK', name: 'Slovaquie', nativeName: 'Slovensko', emoji: '🇸🇰' },
  { id: 'SI', name: 'Slovénie', nativeName: 'Slovenija', emoji: '🇸🇮' },
  { id: 'SE', name: 'Suède', nativeName: 'Sverige', emoji: '🇸🇪' },
  { id: 'CH', name: 'Suisse', nativeName: 'Schweiz', emoji: '🇨🇭' },
  { id: 'UA', name: 'Ukraine', nativeName: 'Ukrajina', emoji: '🇺🇦' },
  { id: 'VA', name: 'Vatican', nativeName: 'Vaticano', emoji: '🇻🇦' }
];
