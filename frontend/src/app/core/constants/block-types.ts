export interface BlockTypeDef {
  name: string;
  description: string;
  iconKey: string;
}

export const BLOCK_TYPES: BlockTypeDef[] = [
  { name: 'Book Card', description: 'Cover, title, tagline, and buy button for a single title', iconKey: 'book' },
  { name: 'Series Reading Order', description: 'Numbered book list with covers for series readers', iconKey: 'blocks' },
  { name: 'Pull Quote', description: 'Styled reader review or excerpt with accent border', iconKey: 'star' },
  { name: 'CTA Button', description: 'Centered call-to-action button with custom label and URL', iconKey: 'link' },
  { name: 'Author Bio', description: 'Headshot, short bio, and social links', iconKey: 'users' },
  { name: 'Social Follow Row', description: 'Follow icons for Instagram, Facebook, Goodreads, and more', iconKey: 'globe' },
];

export const ASSET_CATEGORIES = ['Logo', 'Book Cover', 'Author Photo', 'Other'] as const;
