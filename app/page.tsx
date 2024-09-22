"use client";
import ChatComponent from "@/components/chat";
import Graph from "@/components/graph";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import GraphPortfolio from "../components/graph-portfolio";
import useCreateLeague from "./domains/leagues/useCreateLeague";
import useGetUserLeagues from "./domains/leagues/useGetUserLeagues";
import useJoinLeague from "./domains/leagues/useJoinLeague";
import useGetUserStocks from "./domains/stocks/useGetUserStocks";
import useMakeTrade from "./domains/trades/useMakeTrade";

const data = {
  portfolio_values: [
    {name: "Your Portfolio", value: "$14,592", change: "-1.24%"},
    {name: "Dow Jones", value: "$12,345", change: "+0.56%"},
    {name: "Interest Rate", value: "2.5%", change: "+0.25%"},
    {name: "Inflation", value: "69.5%", change: "+1000%"},
  ],
  leagues: [
    {name: "Global", place: "5th"},
    {name: "Friends", place: "1st"},
    {name: "Private", place: "3rd"},
  ],

  your_stocks: [
    {ticker: "NVDA", stockprice: "$801", owned: "19.3", position: "$29,949", change: "+10.34%"},
    {ticker: "AAPL", stockprice: "$287.45", owned: "5.3", position: "$12,202", change: "-0.56%"},
    {ticker: "GOOGL", stockprice: "$1235.23", owned: "0.02", position: "$10", change: "+1.23%"},
  ],
};
interface Stock {
  ticker: string;
  stockprice: string;
  owned: string;
  position: string;
  change: string;
}

export default function Home() {
  const [selectedLeague, setSelectedLeague] = useState<(typeof leagues)[0] | null>(null);
  const [leagueName, setLeagueName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [modalMode, setModalMode] = useState("join");
  const [tradeType, setTradeType] = useState<"amount" | "price">("amount");
  const [tradeValue, setTradeValue] = useState("");
  const [tradeAction, setTradeAction] = useState<"buy" | "sell">("buy");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const {user} = useUser();
  const {mutate: createLeague} = useCreateLeague();
  const {mutate: joinLeague} = useJoinLeague();
  const {mutate: makeTrade} = useMakeTrade();
  const {data: leagues} = useGetUserLeagues({userId: user?.id || ""});
  const {data: userStocks} = useGetUserStocks({userId: user?.id || ""}) || {};
  console.log("userStocks:", userStocks);
  const { toast } = useToast()


  const userLeaguesWithPlacement =
    leagues?.data?.map(
      (league: {
        name: string;
        id: string;
        code: string;
        label: string;
        data: Array<{userId: string; name: string}>;
      }) => {
        console.log("Processing league:", league);
        if (!league.data) {
          console.warn(`League ${league.name} has no leaderboard data`);
          return {name: league.label, place: "N/A"};
        }
        const userRank = league.data.findIndex(entry => entry.name === user?.fullName);
        console.log("User rank:", userRank);
        return {
          name: league.label,
          place: userRank !== -1 ? `${userRank + 1}${getOrdinalSuffix(userRank + 1)}` : "N/A",
        };
      },
    ) || [];
  console.log("userLeaguesWithPlacement:", userLeaguesWithPlacement);

  const userleagues = userLeaguesWithPlacement.map((league: {name: string; place: string}) => ({
    name: league.name,
    place: league.place,
  }));
  function getOrdinalSuffix(i: number) {
    const j = i % 10,
      k = i % 100;
    if (j == 1 && k != 11) return "st";
    if (j == 2 && k != 12) return "nd";
    if (j == 3 && k != 13) return "rd";
    return "th";
  }

  const handleStockClick = (stock: Stock, action: "buy" | "sell") => {
    setSelectedStock(stock);
    setTradeAction(action);
    setSheetOpen(true);
  };
  const [sortColumn, setSortColumn] = useState("ticker");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (column: keyof Stock) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedStocks = [...userStocks].sort((a, b) => {
    const aValue = a[sortColumn as keyof Stock];
    const bValue = b[sortColumn as keyof Stock];
    const aNum = parseFloat(aValue.replace(/[^0-9.-]+/g, ""));
    const bNum = parseFloat(bValue.replace(/[^0-9.-]+/g, ""));
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
    }
    return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
  });

  const handleCreateLeague = () => {
    createLeague({userId: user?.id || "", leagueName: leagueName});
  };

  const handleJoinLeague = () => {
    joinLeague({userId: user?.id || "", inviteCode});
  };

  const handleSellClick = (tradeDetails: {ticker: string; amount: number; price: number; total: number}) => {
    // Implement the sell logic here
    console.log("Sell details:", tradeDetails);
    makeTrade({
      userId: user?.id || "",
      quantity: tradeDetails.amount,
      price: tradeDetails.price,
      trade_value: tradeDetails.total,
      ticker: tradeDetails.ticker,
    });
  };
  const handleLeagueClick = (league: {name: string}) => {
    const foundLeague = leagues?.data?.find((l: {label: string}) => l.label === league.name);
    if (foundLeague) setSelectedLeague(foundLeague);
  };
  return (
    <div className="dark">
      <div className="grid grid-cols-5 gap-4 w-full p-4">
        {/* Left column */}
        <Card className="bg-[#0c0a09] text-white border-[#221f1e]">
          <div className="flex flex-col p-4 h-full">
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="text-lg">Leaderboard</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-8 px-2 text-sm">
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1c1a19] border-[#221f1e]">
                  <DialogHeader>
                    <DialogTitle className="text-white">Manage Leagues</DialogTitle>
                  </DialogHeader>
                  <Tabs value={modalMode} className="text-white">
                    <TabsList className="grid w-full grid-cols-2 bg-[#0c0a09]">
                      <TabsTrigger
                        onClick={() => setModalMode("join")}
                        value="join"
                        className="data-[state=active]:bg-[#221f1e]"
                      >
                        Join a League
                      </TabsTrigger>
                      <TabsTrigger
                        onClick={() => setModalMode("create")}
                        value="create"
                        className="data-[state=active]:bg-[#221f1e]"
                      >
                        Create a League
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="join">
                      <div className="flex flex-col items-center">
                        <p className="mb-2 text-sm text-gray-400">Enter the 6-digit join code</p>
                        <InputOTP
                          maxLength={6}
                          value={inviteCode}
                          onChange={value => setInviteCode(value.toLowerCase())}
                          pattern="[a-z0-9]"
                        >
                          <InputOTPGroup>
                            {Array.from({length: 6}).map((_, index) => (
                              <InputOTPSlot
                                key={index}
                                index={index}
                                className="w-10 h-12 text-center border rounded bg-white text-black lowercase"
                              />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </TabsContent>
                    <TabsContent value="create">
                      <input
                        type="text"
                        className="w-full p-2 border rounded bg-white text-black"
                        placeholder="Enter league name"
                        value={leagueName}
                        onChange={e => setLeagueName(e.target.value)}
                      />
                    </TabsContent>
                  </Tabs>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        type="submit"
                        className="bg-[#221f1e] text-white hover:bg-[#2c2826]"
                        onClick={() => {
                          if (modalMode === "join") {
                            handleJoinLeague();
                            toast({
                              title: "Joined League",
                              description: "You have successfully joined the league.",
                              variant: "default",
                              className: "bg-[#0c0a09]",
                            });
                          } else {
                            handleCreateLeague();
                            toast({
                              title: "Created League",
                              className: "bg-[#0c0a09]",
                              description: "Your new league has been created.",
                            });
                          }
                        }}
                      >
                        Add
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {!selectedLeague ? (
              <div className="space-y-2">
                {userleagues.map((league: {name: string; place: string}, index: number) => (
                  <Card
                    key={index}
                    className="bg-[#0c0a09] text-white border-[#221f1e] p-3 cursor-pointer hover:bg-[#1c1a19] transition-colors"
                    onClick={() => {
                      handleLeagueClick(league);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{league.name}</h3>
                        <p className="text-sm text-gray-400">{league.place}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="mt-4 h-full flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedLeague.label} Leaderboard</h3>
                    <h1 className="text-sm text-gray-400">Join Code: {selectedLeague.code}</h1>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedLeague(null)}>
                    {" "}
                    Back
                  </Button>
                </div>

                <div className="overflow-auto flex-grow">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedLeague.data.map((entry: {name: string; value: number}, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{entry.name}</TableCell>
                          <TableCell>${entry.value.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Right column */}
        <div className="border-[#221f1e] col-span-4 grid grid-rows-[auto_1fr_1fr] gap-2">
          {/* Top row */}
          <div className="flex justify-between items-center h-12">
            <CardTitle className="pl-4 text-white text-2xl">Market Madness</CardTitle>
            <div className="flex gap-4">
              <SignOutButton>
                <Button variant="outline" size="sm" className="bg-gradient-to-r from-orange-500 to-red-500">
                  Log-Out
                </Button>
              </SignOutButton>
            </div>
          </div>

          {/* Middle row */}
          <div className="grid grid-cols-4 gap-4 mb-3">
            <Card className="bg-[#0c0a09] text-white col-span-1 border-[#221f1e]">
              <CardContent className="grid grid-cols-1 gap-4 pt-4">
                {data.portfolio_values.map((item, index) => (
                  <div key={index} className="bg-[#1c1a19] p-4 rounded-lg">
                    <h3 className="text-md font-medium text-gray-400">{item.name}</h3>
                    <p className="text-3xl font-bold mt-1">{item.value}</p>
                    <span
                      className={`text-md ${
                        item.change.startsWith("+")
                          ? "text-green-500"
                          : item.change.startsWith("-")
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    >
                      {item.change}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="bg-[#0c0a09] text-white col-span-3 border-[#221f1e]">
              <CardContent>
                <GraphPortfolio width={800} height={400} alt="grpah" />
              </CardContent>
            </Card>
          </div>

          {/* Bottom row */}
          <Card className="bg-[#0c0a09] text-white row-span-1 border-[#221f1e]">
            <div className="flex justify-between items-center p-4">
              <CardTitle className="pl-4 text-2xl">Your Portfolio</CardTitle>
              <Button
                variant="outline"
                size="lg"
                className="text-lg bg-gradient-to-r from-green-500 to-green-600 text-white border-none hover:from-green-600 hover:to-green-700 flex items-center"
                onClick={() => (window.location.href = "/market")}
              >
                Market
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
              </Button>
            </div>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("ticker")}>
                      Ticker {sortColumn === "ticker" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("stockprice")}>
                      Stock Price {sortColumn === "stockprice" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("owned")}>
                      Owned {sortColumn === "owned" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("position")}>
                      Position {sortColumn === "position" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("change")}>
                      Change {sortColumn === "change" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedStocks.map((stock, index) => (
                    <TableRow key={index}>
                      <TableCell>{stock.ticker}</TableCell>
                      <TableCell>{stock.stockprice}</TableCell>
                      <TableCell>{stock.owned}</TableCell>
                      <TableCell>{stock.position}</TableCell>
                      <TableCell className={stock.change.startsWith("-") ? "text-red-500" : "text-green-500"}>
                        {stock.change}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center space-x-2">
                          <Button
                            onClick={() => handleStockClick(stock, "buy")}
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                          >
                            Buy
                          </Button>
                          <Button
                            onClick={() => handleStockClick(stock, "sell")}
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                          >
                            Sell
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="left" className="bg-[#0c0a09] border-[#221f1e] w-[800px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>
              {tradeAction === "buy" ? "Buy" : "Sell"} {selectedStock?.ticker}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <p>Current Price: {selectedStock?.stockprice}</p>
            <p>Owned: {selectedStock?.owned}</p>
            <p>Position: {selectedStock?.position}</p>
          </div>
          <div className="py-4">
            <Graph symbol={selectedStock?.ticker} />
          </div>
          <div className="flex items-center space-x-2">
            <Select onValueChange={(value: "amount" | "price") => setTradeType(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select trade type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="amount">Stock Amount</SelectItem>
                <SelectItem value="price">Price Amount</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={tradeValue}
              onChange={e => setTradeValue(e.target.value)}
              placeholder={tradeType === "amount" ? "Enter stock amount" : "Enter price amount"}
            />
            <Button
              onClick={() => {
                if (selectedStock) {
                  const amount =
                    tradeType === "amount"
                      ? parseFloat(tradeValue)
                      : parseFloat(tradeValue) / parseFloat(selectedStock.stockprice.replace("$", ""));
                  console.log({
                    ticker: selectedStock.ticker,
                    amount: amount,
                    price: parseFloat(selectedStock.stockprice.replace("$", "")),
                    total: amount * parseFloat(selectedStock.stockprice.replace("$", "")),
                  });
                  handleSellClick({
                    ticker: selectedStock.ticker,
                    amount: amount,
                    price: parseFloat(selectedStock.stockprice.replace("$", "")),
                    total: amount * parseFloat(selectedStock.stockprice.replace("$", "")),
                  });
                }
              }}
              className={`bg-gradient-to-r ${
                tradeAction === "buy"
                  ? "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  : "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              } text-white border-none`}
            >
              {tradeAction === "buy" ? "Buy" : "Sell"}
            </Button>
          </div>
          <div className="mt-2 text-sm text-gray-400">
            {tradeType === "amount"
              ? `Estimated cost: $${(
                  (parseFloat(tradeValue) || 0) * parseFloat(selectedStock?.stockprice?.replace("$", "") || "0")
                ).toFixed(2)}`
              : `Estimated shares: ${(
                  (parseFloat(tradeValue) || 0) / parseFloat(selectedStock?.stockprice?.replace("$", "") || "1")
                ).toFixed(2)}`}
          </div>
        </SheetContent>
      </Sheet>
      <ChatComponent />
    </div>
  );
}
