"use client";

import {useQuery} from "@tanstack/react-query";

export default function usePortfolioSnapshots() {
  return useQuery({
    queryKey: ["protfolio-snapshots"],
    queryFn: async () => {
      const res = await fetch(`/api/portfoliospanshots`, {
        method: "GET",
      });

      return res.json();
    },
  });
}