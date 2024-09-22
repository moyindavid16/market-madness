"use client";
// import {currentUser} from "@clerk/nextjs/server";
import {useQuery} from "@tanstack/react-query";

export default function useGetAllStocks() {
  return useQuery({
    queryKey: ["user-stocks"],
    queryFn: async () => {
      const res = await fetch(`/api/allStocks/`, {
        method: "GET",
      });

      return res.json();
    },
  });
}
