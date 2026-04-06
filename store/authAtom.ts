"use client";

import { atom } from "jotai";
import { type AuthUser, getMe } from "@/services/authService";

export const authUserAtom = atom<AuthUser | null | undefined>(undefined);

export const hydrateAuthUserAtom = atom(
  null,
  async (get, set, force: boolean = false) => {
    if (!force && get(authUserAtom) !== undefined) {
      return;
    }
    const response = await getMe();
    set(authUserAtom, response.success ? response.data?.user ?? null : null);
  }
);

export const setAuthUserAtom = atom(
  null,
  (_get, set, user: AuthUser | null | undefined) => {
    set(authUserAtom, user);
  }
);
