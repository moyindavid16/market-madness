"use client";
// import {currentUser} from "@clerk/nextjs/server";
import {useMutation} from "@tanstack/react-query";

export default function useCreateLeague() {
  return useMutation({
    mutationFn: (body: {userId: string; leagueName: string}) => {
      return fetch("/api/league/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }).then((res) => res.json());
    },
  });
}
