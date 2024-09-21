'use client'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {Button } from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { useState } from 'react';
import { TableHead, Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import {Dialog,DialogTitle,DialogContent, DialogFooter, DialogTrigger, DialogHeader}from "@/components/ui/dialog"
import { SignOutButton } from "@clerk/nextjs";
const dummyData = {
  tabs: [
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
      ]}
  ],
  bottomTable: [
    { ticker: 'NVDA', stockprice: '$801', your_val: '$10,534', change: '+1.23%' },
    { ticker: 'AAPL', stockprice: '$287.45', your_val: '$10,234', change: '-0.56%' },
    { ticker: 'GOOGL', stockprice: '$1235.23', your_val: '$10,534', change: '+1.23%' }

  ]
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<typeof dummyData.tabs[0]>(dummyData.tabs[0]);

  return (
    <div className="dark">
      <div className="grid grid-cols-5 gap-4 w-full p-4">
        {/* Left column */}
        <Card className="bg-[#0c0a09] text-white border-[#221f1e]">
            <div className="flex flex-col p-4">
              <div className="flex justify-between items-center mb-2">
                <CardTitle className="text-lg">Leaderboard</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="h-8 px-2 text-sm">Add</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Join a League</DialogTitle>
                    </DialogHeader>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Enter Code"
                    />
                    <DialogFooter>
                      <Button type="submit">Add</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {activeTab.label}
                    <span className="ml-2">▼</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60">
                  {dummyData.tabs.map(tab => (
                      <DropdownMenuItem key={tab.id} onSelect={() => setActiveTab(tab)}>
                        {tab.label}
                      </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(activeTab.data[0]).map(key => (
                        <TableHead key={key}>{key}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeTab.data.map((row, index) => (
                      <TableRow key={index}>
                        {Object.values(row).map((value, cellIndex) => (
                            <TableCell key={cellIndex}>{value}</TableCell>
                        ))}
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Right column */}
          <div className="border-[#221f1e] col-span-4 grid grid-rows-3 gap-4">
            {/* Top row */}
            <div className="flex justify-between items-center h-12">
              <CardTitle className="pl-4 text-white text-2xl">Market Madness</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Market</Button>
                <SignOutButton><Button variant="outline" size="sm">Log-Out</Button></SignOutButton>
              </div>
            </div>

            {/* Middle row */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-[#0c0a09] text-white col-span-1 border-[#221f1e]">
                <CardContent>
                  {/* Add cards content here */}
                </CardContent>
              </Card>
              <Card className="bg-[#0c0a09] text-white col-span-2 border-[#221f1e]">
                <CardContent>
                  {/* Add graph content here */}
                </CardContent>
              </Card>
            </div>

            {/* Bottom row */}
            <Card className="bg-[#0c0a09] text-white row-span-1 border-[#221f1e]">
              <CardHeader>
                <CardTitle>Table</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(dummyData.bottomTable[0]).map(key => (
                          <TableHead key={key}>{key}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dummyData.bottomTable.map((row, index) => (
                        <TableRow key={index}>
                          {Object.values(row).map((value, cellIndex) => (
                              <TableCell key={cellIndex}>{value}</TableCell>
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