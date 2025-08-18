// atoms/modalAtom.js
import { atom } from "recoil";

// Prevent duplicate atom keys in HMR (development)
const getAtom = () => {
  if (typeof window !== "undefined") {
    return atom({
      key: "modalState",
      default: false,
    });
  }
  return atom({
    key: "modalState-server", // fallback key for SSR
    default: false,
  });
};

export const modalState = getAtom();



// import { atom } from "recoil";

// // Avoid duplicate atoms during HMR
// export const modalState =
//   global.modalState ??
//   atom({
//     key: "modalState",
//     default: false,
//   });

// export const postIdState =
//   global.postIdState ??
//   atom({
//     key: "postIdState",
//     default: "",
//   });

// // Assign to global to persist across hot reloads
// if (typeof window !== "undefined") {
//   global.modalState = modalState;
//   global.postIdState = postIdState;
// }
