"use client";
// import {currentUser} from "@clerk/nextjs/server";
import {useQuery} from "@tanstack/react-query";

export default function useGetUserLeagues({userId}: {userId: string}) {
  return useQuery({
    queryKey: ["user-leagues"],
    queryFn: async () => {
      const res = await fetch(`/api/league/list/${userId}`, {
        method: "GET",
      });

      return res.json();
    },
  });
}
