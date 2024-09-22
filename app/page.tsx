"use client";
import Graph from "@/components/graph";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardTitle} from "@/components/ui/card";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {SignOutButton, useUser} from "@clerk/nextjs";
import {useState} from "react";
import useCreateLeague from "./domains/leagues/useCreateLeague";
import useJoinLeague from "./domains/leagues/useJoinLeague";
import useMakeTrade from "./domains/trades/useMakeTrade";
const dummyData = {
  portfolio_values: [
    {name: "user", value: "$14,592", change: "-%1.24"},
    {name: "Dow Jones", value: "$12,345", change: "+%0.56"},
    {name: "Interest Rate", value: "2.5%", change: "+0.25"},
  ],
  leagues: [
    {name: "Global", place: "5th", change: -2},
    {name: "Friends", place: "1st", change: 1},
    {name: "Private", place: "3rd", change: 3},
  ],
  full_leaderboards: [
    {
      id: "tab1",
      label: "Global",
      data: [
        {name: "Alice", val: "$14,835"},
        {name: "Bob", val: "$12,450"},
        {name: "Charlie", val: "$9,591"},
        {name: "David", val: "$8,623"},
        {name: "Eve", val: "$7,250"},
        {name: "Frank", val: "$6,550"},
        {name: "Grace", val: "$5,875"},
        {name: "Henry", val: "$5,250"},
        {name: "Ivy", val: "$4,800"},
      ],
    },
    {
      id: "tab2",
      label: "Friends",
      data: [
        {name: "Bob", val: "$12,450"},
        {name: "David", val: "$8,623"},
        {name: "Frank", val: "$6,550"},
        {name: "Henry", val: "$5,250"},
      ],
    },
    {
      id: "tab3",
      label: "Private",
      data: [
        {name: "Charlie", val: "$9,591"},
        {name: "David", val: "$8,623"},
        {name: "Frank", val: "$6,550"},
        {name: "Grace", val: "$5,875"},
      ],
    },
  ],
  your_stocks: [
    {ticker: "NVDA", stockprice: "$801", owned: "$19.3", position:"$29,949", change: "+1.23%"},
    {ticker: "AAPL", stockprice: "$287.45", owned: "5.3", position:"$12,202", change: "-0.56%"},
    {ticker: "GOOGL", stockprice: "$1235.23", owned: "0.02", position:"$10", change: "+1.23%"},
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
  const [selectedLeague, setSelectedLeague] = useState<(typeof dummyData.full_leaderboards)[0] | null>(null);
  const [leagueName, setLeagueName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [modalMode, setModalMode] = useState("join");
  const [tradeType, setTradeType] = useState<'amount' | 'price'>('amount');
  const [tradeValue, setTradeValue] = useState('');
  const [tradeAction, setTradeAction] = useState<'buy' | 'sell'>('buy');
  const {user} = useUser();
  const {mutate: createLeague} = useCreateLeague();
  const {mutate: joinLeague} = useJoinLeague();
  const {mutate: makeTrade} = useMakeTrade();

  const handleStockClick = (stock: Stock, action: 'buy' | 'sell') => {
    setSelectedStock(stock);
    setTradeAction(action);
    setSheetOpen(true);
  };

  const [sortColumn, setSortColumn] = useState('ticker');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (column: keyof Stock) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedStocks = [...dummyData.your_stocks].sort((a, b) => {
    if (a[sortColumn as keyof Stock] < b[sortColumn as keyof Stock]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn as keyof Stock] > b[sortColumn as keyof Stock]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleCreateLeague = () => {
    createLeague({userId: user?.id || "", leagueName: leagueName});
  };

  const handleJoinLeague = () => {
    joinLeague({userId: user?.id || "", inviteCode});
  };

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  const handleSellClick = (tradeDetails: { ticker: string; amount: number; price: number; total: number }) => {
    // Implement the sell logic here
    console.log('Sell details:', tradeDetails);
    makeTrade({userId: user?.id || "", quantity: tradeDetails.amount, price: tradeDetails.price, trade_value: tradeDetails.total, ticker: tradeDetails.ticker});
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
                      <input
                        type="text"
                        className="w-full p-2 border rounded bg-white text-black"
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        pattern="\d{6}"
                        value={inviteCode}
                        onChange={e => setInviteCode(e.target.value)}
                      />
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
                    <Button
                      type="submit"
                      className="bg-[#221f1e] text-white hover:bg-[#2c2826]"
                      onClick={() => (modalMode === "join" ? handleJoinLeague() : handleCreateLeague())}
                    >
                      Add
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {!selectedLeague ? (
              <div className="space-y-2">
                {dummyData.leagues.map((league, index) => (
                  <Card
                    key={index}
                    className="bg-[#0c0a09] text-white border-[#221f1e] p-3 cursor-pointer hover:bg-[#1c1a19] transition-colors"
                    onClick={() => {
                      const foundLeague = dummyData.full_leaderboards.find(l => l.label === league.name);
                      if (foundLeague) setSelectedLeague(foundLeague);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{league.name}</h3>
                        <p className="text-sm text-gray-400">{league.place}</p>
                      </div>
                      <div className={`flex items-center ${league.change > 0 ? "text-green-500" : "text-red-500"}`}>
                        {league.change > 0 ? "↑" : "↓"}
                        <span className="ml-1">{Math.abs(league.change)}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="mt-4 h-full flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{selectedLeague.label} Leaderboard</h3>
                  <Button variant="outline" size="sm" onClick={() => setSelectedLeague(null)}>
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
                      {selectedLeague.data.map((entry, index) => (
                        <TableRow key={index}>
                          <TableCell>{entry.name}</TableCell>
                          <TableCell>{entry.val}</TableCell>
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
            <div className="flex gap-2">
              <SignOutButton>
                <Button variant="outline" size="sm" className="bg-gradient-to-r from-orange-500 to-red-500">
                  Log-Out
                </Button>
              </SignOutButton>
            </div>
          </div>

          {/* Middle row */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-[#0c0a09] text-white col-span-1 border-[#221f1e]">
              <CardContent className="grid grid-cols-1 gap-4 pt-4">
                {dummyData.portfolio_values.map((item, index) => (
                  <div key={index} className="bg-[#1c1a19] p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-400">{item.name}</h3>
                    <p className="text-2xl font-bold mt-1">{item.value}</p>
                    <span
                      className={`text-sm ${
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
            <Card className="bg-[#0c0a09] text-white col-span-2 border-[#221f1e]">
              <CardContent>
                <Graph width={800} height={400} alt="grpah" />
              </CardContent>
            </Card>
          </div>

          {/* Bottom row */}
          <Card className="bg-[#0c0a09] text-white row-span-1 border-[#221f1e]">
            <div className="flex justify-between items-center p-4">
              <CardTitle className="pl-4 text-2xl">Your Portfolio</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white border-none hover:from-green-600 hover:to-green-700"
                onClick={() => window.location.href = '/market'}
              >
                Market
              </Button>
            </div>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => handleSort('ticker')}>
                      Ticker {sortColumn === 'ticker' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead onClick={() => handleSort('stockprice')}>
                      Stock Price {sortColumn === 'stockprice' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead onClick={() => handleSort('owned')}>
                      Owned {sortColumn === 'owned' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead onClick={() => handleSort('position')}>
                      Position {sortColumn === 'position' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead onClick={() => handleSort('change')}>
                      Change {sortColumn === 'change' && (sortDirection === 'asc' ? '↑' : '↓')}
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
                        <TableCell className={stock.change.startsWith('-') ? 'text-red-500' : 'text-green-500'}>
                          {stock.change}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center space-x-2">
                            <Button
                                onClick={() => handleStockClick(stock, 'buy')}
                                className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                            >
                              Buy
                            </Button>
                            <Button
                                onClick={() => handleStockClick(stock, 'sell')}
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
            <SheetTitle>{tradeAction === 'buy' ? 'Buy' : 'Sell'} {selectedStock?.ticker}</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <p>Current Price: {selectedStock?.stockprice}</p>
            <p>Owned: {selectedStock?.owned}</p>
            <p>Position: {selectedStock?.position}</p>
          </div>
        <div className="py-4">
          <Graph
            symbol={selectedStock?.ticker}
          />
        </div>
          <div className="flex items-center space-x-2">
            <Select onValueChange={(value: 'amount' | 'price') => setTradeType(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select trade type"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="amount">Stock Amount</SelectItem>
                <SelectItem value="price">Price Amount</SelectItem>
              </SelectContent>
            </Select>
            <Input
                type="number"
                value={tradeValue}
                onChange={(e) => setTradeValue(e.target.value)}
                placeholder={tradeType === 'amount' ? 'Enter stock amount' : 'Enter price amount'}
            />
            <Button
                onClick={() => {
                  if (selectedStock) {
                    const amount = tradeType === 'amount' ? parseFloat(tradeValue) : parseFloat(tradeValue) / parseFloat(selectedStock.stockprice.replace('$', ''));
                    handleSellClick({
                      ticker: selectedStock.ticker,
                      amount: amount,
                      price: parseFloat(selectedStock.stockprice.replace('$', '')),
                      total: amount * parseFloat(selectedStock.stockprice.replace('$', ''))
                    });
                  }
                }}
                className={`bg-gradient-to-r ${tradeAction === 'buy' ? 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' : 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'} text-white border-none`}
            >
              {tradeAction === 'buy' ? 'Buy' : 'Sell'}
            </Button>

          </div>
          <div className="mt-2 text-sm text-gray-400">
            {tradeType === 'amount' ?
                `Estimated cost: $${((parseFloat(tradeValue) || 0) * parseFloat(selectedStock?.stockprice?.replace('$', '') || '0')).toFixed(2)}` :
                `Estimated shares: ${((parseFloat(tradeValue) || 0) / parseFloat(selectedStock?.stockprice?.replace('$', '') || '1')).toFixed(2)}`
            }
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}