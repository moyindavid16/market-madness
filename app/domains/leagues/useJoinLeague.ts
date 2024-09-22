"use client";
// import {currentUser} from "@clerk/nextjs/server";
import {useMutation} from "@tanstack/react-query";

export default function useJoinLeague() {
  return useMutation({
    mutationFn: (body: {userId: string; inviteCode: string}) => {
      return fetch(`/api/league/${body.inviteCode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }).then((res) => res.json());
    },
  });
}
