"use client";

import {useMutation} from "@tanstack/react-query";

export default function useStockData() {
  return useMutation({
    mutationFn: (symbol: string) => {
      return fetch(`/api/stocks?symbol=${symbol}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      }).then((res) => res.json());
    },
  });
}