import prisma from "@/app/db/prisma";
import {NextResponse} from "next/server";

export async function GET() {
  // Do whatever you want
  const topCompanies = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META', 'BRK.B', 'LLY', 'AVGO', 'TSM', 'TSLA', 'WMT', 'JPM', 'NVO', 'V', 'UNH', 'XOM', 'ORCL', 'MA', 'PG', 'COST', 'JNJ', 'HD', 'ABBV', 'ASML', 'BAC', 'KO', 'NFLX', 'MRK', 'CVX', 'SAP', 'CRM', 'AMD', 'TM', 'AZN', 'NVS', 'PEP', 'TMO', 'TMUS', 'ADBE', 'LIN', 'SHEL', 'MCD', 'ACN', 'CSCO', 'BABA', 'GE', 'IBM', 'ABT', 'DHR', 'NOW', 'WFC', 'AXP', 'QCOM', 'PM', 'VZ', 'TXN', 'AMGN', 'INTU', 'CAT', 'ISRG', 'RY', 'DIS', 'NEE', 'PFE', 'GS', 'MS', 'SPGI', 'UL', 'HDB', 'TTE', 'AMAT', 'HSBC', 'RTX', 'UBER', 'CMCSA', 'T', 'PGR', 'UNP', 'LOW', 'ARM', 'SNY', 'SYK', 'BHP', 'PDD', 'BLK', 'LMT', 'BKNG', 'TJX', 'HON', 'ETN', 'NKE', 'COP', 'ELV', 'BUD', 'REGN', 'BSX', 'BX', 'ANET', 'VRTX'];
  const stocks = [];

  for (let i = 0; i < topCompanies.length; i++) {
    const companyData = await prisma.market.findMany({
      where: {
        ticker: topCompanies[i]
      },
      take: 2
    });

    stocks.push({
      ticker: topCompanies[i], 
      price: companyData[0].price, 
      change: ((companyData[0].price - companyData[1].price) / companyData[1].price) * 100
    });
  }

  return NextResponse.json({stocks: stocks}, {status: 200});
}