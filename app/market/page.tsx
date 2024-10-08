"use client";
import {use, useState} from "react";
import Graph from "@/components/graph";
import {Card, CardTitle, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription} from "@/components/ui/sheet";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Table, TableHead, TableHeader, TableBody, TableRow, TableCell} from "@/components/ui/table";
import useGetUserTrades from "../domains/trades/useGetUserTrades";
import useGetAllStocks from "../domains/stocks/useGetAllStocks"
import {useUser} from "@clerk/nextjs";
interface Stock {
  ticker: string;
  price: string;
  change: string;
}
// Dummy data for demonstration
const Stocks = [
  {ticker: "AAPL", price: "$150.25", change: "+1.5%"},
  {ticker: "GOOGL", price: "$2,750.80", change: "-0.8%"},
  {ticker: "MSFT", price: "$305.50", change: "+0.5%"},
  {ticker: "AMZN", price: "$3,305.00", change: "+2.1%"},
  {ticker: "FB", price: "$330.75", change: "-1.2%"},
];

// const Trades = [
//   {date: "2024-03-15", ticker: "AAPL",  quantity: 10, price: "$150.25"},
//   {date: "2024-03-14", ticker: "GOOGL",  quantity: 5, price: "$2,750.80"},
//   {date: "2024-03-13", ticker: "MSFT", quantity: 15, price: "$305.50"},
// ];

export default function MarketPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("ticker");
  const [sortDirection, setSortDirection] = useState("asc");
  const {user} = useUser();
  const {data: userTrades = {data: []}} = useGetUserTrades({userId: user?.id || ""});
  const {data: allStocks} = useGetAllStocks();
  const Trades = userTrades.data || [];
  console.log("User trades:", Trades);
  console.log("All stocks:", allStocks);
  const filteredStocks = (allStocks?.stocks || []).filter(stock => stock.ticker.toLowerCase().includes(searchTerm.toLowerCase())).sort(
    (a, b) => {
      const aValue = a[sortColumn as keyof Stock];
      const bValue = b[sortColumn as keyof Stock];

      if (sortColumn === "price" || sortColumn === "change") {
        // const aNum = parseFloat(aValue.replace(/[^0-9.-]+/g, ""));
        // const bNum = parseFloat(bValue.replace(/[^0-9.-]+/g, ""));
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    },
  );

  const handleSort = (column: "ticker" | "price" | "change") => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const [sheetOpen, setSheetOpen] = useState(false);
  const [tradeType, setTradeType] = useState("amount"); // 'amount' or 'price'
  const [tradeValue, setTradeValue] = useState("");

  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  const handleStockClick = (stock: Stock) => {
    setSelectedStock(stock);
    setSheetOpen(true);
  };
  return (
    <div className="dark">
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-[#0c0a09] text-white border-[#221f1e] col-span-1">
            <CardContent className="p-6">
              <CardTitle className="text-xl mb-4">Trade History</CardTitle>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Ticker</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {Trades.map((trade: {
                  date: string;
                  ticker: string;
                  action: string;
                  quantity: number;
                  price: string;
                }, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{trade.date.split('T')[0]}</TableCell>
                      <TableCell>{trade.ticker}</TableCell>
                      <TableCell>{trade.quantity.toFixed(3)}</TableCell>
                      <TableCell>${trade.price}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="bg-[#0c0a09] text-white border-[#221f1e] col-span-2">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <CardTitle className="text-2xl">Stock Market</CardTitle>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "/")}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none hover:from-blue-600 hover:to-blue-700"
                >
                  Back to Dashboard
                </Button>
              </div>

              <Input
                type="text"
                placeholder="Search stocks..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="mb-4 bg-[#1c1a19] border-[#221f1e] text-white"
              />

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => handleSort("ticker")} className="cursor-pointer">
                      Ticker {sortColumn === "ticker" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead onClick={() => handleSort("price")} className="cursor-pointer">
                      Price {sortColumn === "price" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead onClick={() => handleSort("change")} className="cursor-pointer">
                      Change {sortColumn === "change" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStocks.map(stock => (
                    <TableRow key={stock.ticker}>
                      <TableCell>{stock.ticker}</TableCell>
                      <TableCell>{stock.price}</TableCell>
                      <TableCell className={stock.change>=0 ? "text-green-500" : "text-red-500"}>
                        {stock.change}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStockClick(stock)}
                          className="bg-gradient-to-r from-green-500 to-green-600 text-white border-none hover:from-green-600 hover:to-green-700"
                        >
                          Buy
                        </Button>
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
            <SheetTitle className="text-2xl">{selectedStock?.ticker}</SheetTitle>
            <SheetDescription className="text-xl">
              <span className="text-2xl font-bold">{selectedStock?.price}</span> |{" "}
              <span
                className={`text-2xl font-bold ${
                  selectedStock?.change || 0>=0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {selectedStock?.change}
              </span>
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <Graph symbol={selectedStock?.ticker} />
          </div>
          <div className="flex items-center space-x-2">
            <Select onValueChange={value => setTradeType(value)}>
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
                /* Implement buy logic */
              }}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white border-none hover:from-green-600 hover:to-green-700"
            >
              Buy
            </Button>
          </div>
          <div className="mt-2 text-sm text-gray-400">
            {tradeType === "amount"
              ? `Estimated cost: $${(
                  (parseFloat(tradeValue) || 0) * parseFloat(selectedStock?.price?.replace("$", "") || "0")
                ).toFixed(2)}`
              : `Estimated shares: ${(
                  (parseFloat(tradeValue) || 0) / parseFloat(selectedStock?.price?.replace("$", "") || "1")
                ).toFixed(2)}`}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
