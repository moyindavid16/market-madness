"use client";
// import {currentUser} from "@clerk/nextjs/server";
import {useQuery} from "@tanstack/react-query";

export default function useGetUserStocks({userId}: {userId: string}) {
  return useQuery({
    queryKey: ["user-stocks"],
    queryFn: async () => {
      const res = await fetch(`/api/stocks/user/${userId}`, {
        method: "GET",
      });

      return res.json();
    },
  });
}
