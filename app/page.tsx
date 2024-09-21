'use client'
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import {Button } from "@/components/ui/button";
import { useState } from 'react';
import {Tabs, TabsTrigger, TabsContent, TabsList} from "@/components/ui/tabs";
import { TableHead, Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import {Dialog,DialogTitle,DialogContent, DialogFooter, DialogTrigger, DialogHeader}from "@/components/ui/dialog"
import Graph from "@/components/graph";
import { SignOutButton } from "@clerk/nextjs";
const dummyData = {
  portfolio_values:[
    {name: 'Your Portfolio', value: '$14,592', change:'-%1.24'},
    {name: 'Dow Jones', value: '$12,345', change:'+%0.56'},
    {name:'Interest Rate', value: '2.5%', change: '+0.25'},
  ],
  leagues: [
    {name: 'Global', place: '5th', change: -2},
    {name: 'Friends', place: '1st', change: 1},
    {name: 'Private', place: '3rd', change: 3},
  ],
  full_leaderboards: [
    { id: 'tab1', label: 'Global', data: [
        { name: 'Alice', val: '$14,835' },
        { name: 'Bob', val: '$12,450' },
        { name: 'Charlie', val: '$9,591' },
        { name: 'David', val: '$8,623' },
        { name: 'Eve', val: '$7,250' },
        { name: 'Frank', val: '$6,550' },
        { name: 'Grace', val: '$5,875' },
        { name: 'Henry', val: '$5,250' },
        { name: 'Ivy', val: '$4,800' },
      ]},
    { id: 'tab2', label: 'Friends', data: [
        { name: 'Bob', val: '$12,450' },
        { name: 'David', val: '$8,623' },
        { name: 'Frank', val: '$6,550' },
        { name: 'Henry', val: '$5,250' },
      ]},
      { id: 'tab3', label: 'Private', data: [
        { name: 'Charlie', val: '$9,591' },
        { name: 'David', val: '$8,623' },
        { name: 'Frank', val: '$6,550' },
        { name: 'Grace', val: '$5,875' },
        ]},
  ],
  your_stocks: [
    { ticker: 'NVDA', stockprice: '$801', your_val: '$10,534', change: '+1.23%' },
    { ticker: 'AAPL', stockprice: '$287.45', your_val: '$10,234', change: '-0.56%' },
    { ticker: 'GOOGL', stockprice: '$1235.23', your_val: '$10,534', change: '+1.23%' }

  ]
};

export default function Home() {
  const [selectedLeague, setSelectedLeague] = useState<typeof dummyData.full_leaderboards[0] | null>(null);
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
                          <Button variant="outline" className="h-8 px-2 text-sm">Add</Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#1c1a19] border-[#221f1e]">
                          <DialogHeader>
                              <DialogTitle className="text-white">Manage Leagues</DialogTitle>
                          </DialogHeader>
                          <Tabs defaultValue="join" className="text-white">
                              <TabsList className="grid w-full grid-cols-2 bg-[#0c0a09]">
                                  <TabsTrigger value="join" className="data-[state=active]:bg-[#221f1e]">Join a League</TabsTrigger>
                                  <TabsTrigger value="create" className="data-[state=active]:bg-[#221f1e]">Create a League</TabsTrigger>
                              </TabsList>
                              <TabsContent value="join">
                                  <input
                                      type="text"
                                      className="w-full p-2 border rounded bg-white text-black"
                                      placeholder="Enter 6-digit code"
                                      maxLength={6}
                                      pattern="\d{6}"
                                  />
                              </TabsContent>
                              <TabsContent value="create">
                                  <input
                                      type="text"
                                      className="w-full p-2 border rounded bg-white text-black"
                                      placeholder="Enter league name"
                                  />
                              </TabsContent>
                          </Tabs>
                          <DialogFooter>
                              <Button type="submit" className="bg-[#221f1e] text-white hover:bg-[#2c2826]">Add</Button>
                          </DialogFooter>
                      </DialogContent>
                  </Dialog>
              </div>
              {!selectedLeague ? (
                <div className="space-y-2">
                  {dummyData.leagues.map((league, index) => (
                    <Card key={index} className="bg-[#0c0a09] text-white border-[#221f1e] p-3 cursor-pointer hover:bg-[#1c1a19] transition-colors"
                          onClick={() => {
                            const foundLeague = dummyData.full_leaderboards.find(l => l.label === league.name);
                            if (foundLeague) setSelectedLeague(foundLeague);
                          }}>
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{league.name}</h3>
                          <p className="text-sm text-gray-400">{league.place}</p>
                        </div>
                        <div className={`flex items-center ${league.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {league.change > 0 ? '↑' : '↓'}
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
                    <Button variant="outline" size="sm" onClick={() => setSelectedLeague(null)}>Back</Button>
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
                <div className="flex justify-between items-center h-16">
                    <CardTitle className="pl-4 text-white text-2xl">Market Madness</CardTitle>
                    <div className="flex gap-4">
                        <SignOutButton>
                            <Button
                                variant="outline"
                                size="lg"
                                className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-none hover:from-red-600 hover:to-orange-600"
                            >
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
                                        className={`text-sm ${item.change.startsWith('+') ? 'text-green-500' : item.change.startsWith('-') ? 'text-red-500' : 'text-gray-400'}`}>
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
                <Card className="bg-[#0c0a09] text-white row-span-1 border-[#221f1e] relative">
                    <div className="flex justify-between items-center p-4">
                        <CardTitle className="text-2xl pl-4">Your Portfolio</CardTitle>
                        <Button
                            variant="outline"
                            size="lg"
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
                                    {Object.keys(dummyData.your_stocks[0]).map(key => (
                                        <TableHead key={key}>{key}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dummyData.your_stocks.map((row, index) => (
                                    <TableRow key={index}>
                                        {Object.entries(row).map(([key, value], cellIndex) => (
                                            <TableCell
                                                key={cellIndex}
                                                className={key === 'change' ? (
                                                    value.startsWith('-') ? 'text-red-500' : 'text-green-500'
                                                ) : ''}
                                            >
                                                {value}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
  );
}