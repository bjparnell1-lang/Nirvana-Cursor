export interface NavLink {
  label: string;
  href: string;
}

export interface NavCard {
  slug: string;
  name: string;
  href: string;
  thumbnail: string;
  thumbnailAlt: string;
  lede: string;
}

export const topLevel: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Foundation', href: '/foundation' },
];

export const programs: NavCard[] = [
  {
    slug: 'cancer-care',
    name: 'Integrative Cancer Care',
    href: '/programs/cancer-care',
    thumbnail: '/images/programs/cancer-care-hero.jpg',
    thumbnailAlt: 'Cancer care program',
    lede: 'Whole-person support during and after oncology treatment.',
  },
  {
    slug: 'diabetes-reversal',
    name: 'Diabetes Reversal',
    href: '/programs/diabetes-reversal',
    thumbnail: '/images/programs/diabetes-reversal-hero.jpg',
    thumbnailAlt: 'Diabetes reversal program',
    lede: 'Reset metabolic health through nutrition, lab work, and lifestyle.',
  },
  {
    slug: 'hormone-harmony',
    name: 'Hormone Harmony',
    href: '/programs/hormone-harmony',
    thumbnail: '/images/programs/hormone-harmony-hero.jpg',
    thumbnailAlt: 'Hormone harmony program',
    lede: 'Restore balance across thyroid, adrenal, and reproductive hormones.',
  },
  {
    slug: 'autoimmune-support',
    name: 'Autoimmune Support',
    href: '/programs/autoimmune-support',
    thumbnail: '/images/programs/autoimmune-support-hero.jpg',
    thumbnailAlt: 'Autoimmune support program',
    lede: 'Calm the immune response by addressing underlying drivers.',
  },
  {
    slug: 'gut-health',
    name: 'Gut Health',
    href: '/programs/gut-health',
    thumbnail: '/images/programs/gut-health-hero.jpg',
    thumbnailAlt: 'Gut health program',
    lede: 'Repair the gut to restore systemic resilience.',
  },
];

export const services: NavCard[] = [
  {
    slug: 'iv-therapy',
    name: 'IV Therapy',
    href: '/services/iv-therapy',
    thumbnail: '/images/services/iv-therapy-hero.jpg',
    thumbnailAlt: 'IV therapy',
    lede: 'Targeted infusions for hydration, performance, wellness, beauty, and detox.',
  },
  {
    slug: 'colon-hydrotherapy',
    name: 'Colon Hydrotherapy',
    href: '/services/colon-hydrotherapy',
    thumbnail: '/images/services/colon-hydrotherapy-hero.jpg',
    thumbnailAlt: 'Colon hydrotherapy',
    lede: 'Gentle, supervised colonic irrigation for digestive support.',
  },
  {
    slug: 'sauna-body-wrap',
    name: 'Sauna and Body Wrap',
    href: '/services/sauna-body-wrap',
    thumbnail: '/images/services/sauna-body-wrap-hero.jpg',
    thumbnailAlt: 'Sauna and body wrap',
    lede: 'Infrared heat plus mineral-rich body treatments.',
  },
  {
    slug: 'laser-lipo',
    name: 'Laser Lipo',
    href: '/services/laser-lipo',
    thumbnail: '/images/services/laser-lipo-hero.jpg',
    thumbnailAlt: 'Laser lipo',
    lede: 'Non-invasive body contouring via low-level laser therapy.',
  },
  {
    slug: 'foot-detox',
    name: 'Foot Detox',
    href: '/services/foot-detox',
    thumbnail: '/images/services/foot-detox-hero.jpg',
    thumbnailAlt: 'Foot detox',
    lede: 'Ionic foot bath as part of a broader detox protocol.',
  },
  {
    slug: 'fit-3d-body-scan',
    name: 'Fit3D Body Scan',
    href: '/services/fit-3d-body-scan',
    thumbnail: '/images/services/fit-3d-body-scan-hero.jpg',
    thumbnailAlt: 'Fit3D body scan',
    lede: 'Precise body composition tracking for measurable progress.',
  },
  {
    slug: 'massage',
    name: 'Massage',
    href: '/services/massage',
    thumbnail: '/images/services/massage-hero.jpg',
    thumbnailAlt: 'Massage therapy',
    lede: 'Therapeutic and relaxation modalities tailored to your needs.',
  },
  {
    slug: 'acupuncture',
    name: 'Acupuncture',
    href: '/services/acupuncture',
    thumbnail: '/images/services/acupuncture-hero.jpg',
    thumbnailAlt: 'Acupuncture',
    lede: 'Traditional Chinese medicine for pain, stress, and recovery.',
  },
  {
    slug: 'wellness-consultation',
    name: 'Wellness Consultation',
    href: '/services/wellness-consultation',
    thumbnail: '/images/services/wellness-consultation-hero.jpg',
    thumbnailAlt: 'Wellness consultation',
    lede: 'A thorough first conversation to map your care plan.',
  },
];

export const bookCta: NavLink = { label: 'Book Appointment', href: '/book-appointment' };
