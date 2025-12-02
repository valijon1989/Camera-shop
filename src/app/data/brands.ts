export interface CameraBrandAsset {
  name: string;
  slug: string;
  logo: string;
  banner?: string;
  description?: string;
}

// Fallback statik ma’lumot
export const cameraBrandData: Record<
  string,
  { logo: string; banner: string; description: string }
> = {
  Sony: {
    logo: "/brands/sony.png",
    banner: "/brands/sony-banner.jpg",
    description:
      "Sony — mirrorless kameralar bozorining yetakchisi. Alpha seriyasi professional foto va video uchun eng kuchli platforma.",
  },
  Canon: {
    logo: "/brands/canon.png",
    banner: "/brands/canon-banner.jpg",
    description:
      "Canon — DSLR va RF mirrorless tizimlarida professional sifatni taqdim etadi.",
  },
  Nikon: {
    logo: "/brands/nikon.png",
    banner: "/brands/nikon-banner.jpg",
    description:
      "Nikon — optika va sensor texnologiyalari bo‘yicha eng kuchli brendlardan biri.",
  },
  Fujifilm: {
    logo: "/brands/fuji.png",
    banner: "/brands/fuji-banner.jpg",
    description:
      "Fujifilm — retro dizayn va rangni qayta ishlash bo‘yicha eng zo‘r mirrorless tizim.",
  },
  Panasonic: {
    logo: "/brands/panasonic.png",
    banner: "/brands/panasonic-banner.jpg",
    description: "Panasonic — video va hybrid kameralar uchun kuchli Lumix ekotizimi.",
  },
};

export const cameraBrands = Object.keys(cameraBrandData);
