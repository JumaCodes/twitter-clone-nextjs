// atoms/postIdAtom.js
import { atom } from "recoil";

export const postIdState = atom({
  key: "postIdState", // must be globally unique
  default: "",
});
