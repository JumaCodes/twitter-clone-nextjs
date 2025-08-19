// atoms/modalAtom.js
import { atom } from "recoil";

export const modalState = atom({
  key: "modalState", // must be globally unique
  default: false,
});

