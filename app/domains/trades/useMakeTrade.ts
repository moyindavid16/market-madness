"use client";
// import {currentUser} from "@clerk/nextjs/server";
import {useMutation} from "@tanstack/react-query";

export default function useMakeTrade() {
  return useMutation({
    mutationFn: (body: {userId: string; quantity: number; price: number, trade_value: number, ticker: string}) => {
      return fetch("/api/trade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }).then((res) => res.json());
    },
  });
}
