"use client";

import {useQuery} from "@tanstack/react-query";

export default function useStockData(symbol: string) {
  return useQuery({
    queryKey: ["stock-data", symbol],
    queryFn: async () => {
      const res = await fetch(`/api/stocks?symbol=${symbol}`, {
        method: "GET",
      });

      return res.json();
    },
  });
}