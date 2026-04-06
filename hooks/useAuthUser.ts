"use client";

import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { authUserAtom, hydrateAuthUserAtom, setAuthUserAtom } from "@/store/authAtom";

export function useAuthUser() {
  const user = useAtomValue(authUserAtom);
  const hydrateAuthUser = useSetAtom(hydrateAuthUserAtom);
  const setAuthUser = useSetAtom(setAuthUserAtom);

  useEffect(() => {
    void hydrateAuthUser(false);
  }, [hydrateAuthUser]);

  return {
    user: user ?? null,
    isLoading: user === undefined,
    isAuthenticated: Boolean(user),
    setUser: setAuthUser,
    refreshUser: () => hydrateAuthUser(true),
  };
}
