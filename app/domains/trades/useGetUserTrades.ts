"use client";
// import {currentUser} from "@clerk/nextjs/server";
import {useQuery} from "@tanstack/react-query";

export default function useGetUserTrades({userId}: {userId: string}) {
  return useQuery({
    queryKey: ["user-trades"],
    queryFn: async () => {
      const res = await fetch(`/api/trade/history/${userId}`, {
        method: "GET",
      });

      return res.json();
    },
  });
}
