// atoms/postIdAtom.js
import { atom } from "recoil";

const getAtom = () => {
  if (typeof window !== "undefined") {
    return atom({
      key: "postIdState",
      default: "",
    });
  }
  return atom({
    key: "postIdState-server",
    default: "",
  });
};

export const postIdState = getAtom();
