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
      "Canon — DSLR va RF mirrorless tizimlari uchun yuqori sifatli optika, barqarorlik va professional tizimlar.",
  },
  Nikon: {
    logo: "/brands/nikon.png",
    banner: "/brands/nikon-banner.jpg",
    description:
      "Nikon — optika, full-frame sensorlar va professional kamera tizimlari bilan mashhur brend.",
  },
  Fujifilm: {
    logo: "/brands/fuji.png",
    banner: "/brands/fuji-banner.jpg",
    description:
      "Fujifilm — retro dizayn va ranglarni tabiiy qayta ishlash bo‘yicha eng yaxshi mirrorless kameralar ishlab chiqaruvchisi.",
  },
  Panasonic: {
    logo: "/brands/panasonic.png",
    banner: "/brands/panasonic-banner.jpg",
    description:
      "Panasonic — GH va S seriyalari bilan video ishlab chiqaruvchilar orasida mashhur brend.",
  },
};

export const cameraBrands = Object.keys(cameraBrandData);
