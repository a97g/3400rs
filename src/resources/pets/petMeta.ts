import { PET_DEFINITIONS, PetCategoryKey } from "./catalog";

export const PET_CATEGORY_LABELS: Record<PetCategoryKey, string> = {
  group: "Group",
  skilling: "Skilling",
  gwd: "GWD",
  dks: "DKS",
  slayer: "Slayer",
  quest: "Quest",
  pvmMinigame: "PvM Minigame",
  wilderness: "Wilderness",
  raids: "Raids",
  skillingMinigames: "Skilling Minigames",
  misc: "Miscellaneous",
};

export const PET_DISPLAY_ORDER: PetCategoryKey[] = [
  "group",
  "skilling",
  "gwd",
  "dks",
  "slayer",
  "quest",
  "pvmMinigame",
  "wilderness",
  "raids",
  "skillingMinigames",
  "misc",
];

export const DUST_PETS = ["Metamorphic Dust", "Sanguine Dust"] as const;
export const TOA_TRANSMOG_PETS = ["Akkha", "Baba", "Kephri", "Zebak", "Warden"] as const;
export const NON_MAIN_PETS = [...DUST_PETS, ...TOA_TRANSMOG_PETS] as const;

export const PET_ORDER = PET_DEFINITIONS.map((pet) => pet.name);

export const PET_ID_TO_NAME = PET_DEFINITIONS.reduce(
  (acc, pet) => {
    acc[pet.templeItemId] = pet.name;
    return acc;
  },
  {} as Record<number, string>,
);

export const PET_HOURS_BY_NAME = PET_DEFINITIONS.reduce(
  (acc, pet) => {
    acc[pet.name] = pet.hours;
    return acc;
  },
  {} as Record<string, number>,
);

export const PET_DISPLAY_SECTIONS = PET_DISPLAY_ORDER.map((category) => ({
  label: PET_CATEGORY_LABELS[category],
  petNames: PET_DEFINITIONS.filter((pet) => pet.category === category).map((pet) => pet.name),
}));

export const TOTAL_PETS = PET_DEFINITIONS.length;
export const TOTAL_PET_HOURS = 5493;
