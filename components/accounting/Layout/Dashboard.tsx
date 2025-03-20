'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@heroui/card';
import { BriefcaseIcon, CalendarIcon, CogIcon, CurrencyDollarIcon, DocumentIcon, HomeIcon, UserIcon, UsersIcon } from '@heroicons/react/24/outline';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, RadialLinearScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  ArcElement,
);

interface ConsignmentItem {
  date: string;
  status: string;
  total_payment: string;
  totalPaid?: number;
  totalUnpaid?: number;
}

const AccountingDashboard = () => {
  const [receivables, setReceivables] = useState(0);
  const [totalBudgetRequest, setTotalBudgetRequest] = useState(0);
  const [transactions, setTransactions] = useState(0);
  const [accounts, setAccounts] = useState(0);

  const [chartData, setChartData] = useState({
    labels: ['Receivables', 'Total Budget Request', 'Total Transactions', 'Accounts'],
    datasets: [
      {
        label: 'Financial Data',
        data: [receivables, totalBudgetRequest, transactions, accounts],
        backgroundColor: ['#3b82f6', '#10b981', '#fbbf24', '#ef4444'],
        borderColor: ['#2563eb', '#059669', '#f59e0b', '#dc2626'],
        borderWidth: 1,
      },
    ],
  });

  const [consigData, setConsigData] = useState({
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    datasets: [
      {
        label: 'Total Paid',
        data: Array(12).fill(0),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        fill: true,
      },
      {
        label: 'Total Unpaid',
        data: Array(12).fill(0),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        fill: true,
      }
    ]
  });

  const [inhouseData, setInhouseData] = useState({
    labels: ['Per Trip', 'Per Month', 'Per Year'],
    datasets: [
      {
        label: 'Inhouse Report',
        data: [0, 0, 0],
        backgroundColor: ['#10b981', '#fbbf24', '#3b82f6'], 
        borderColor: ['#059669', '#f59e0b', '#2563eb'],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const receivableRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/getReceivable`);
        const receivableData = await receivableRes.json();
        setReceivables(receivableData.count || 0);

        const budgetRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/requestbudget`);
        const budgetData = await budgetRes.json();
        setTotalBudgetRequest(budgetData.count || 0);

        const transactionRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/transactions`);
        const transactionData = await transactionRes.json();
        setTransactions(transactionData.count || 0);

        const accountRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/gdr-accounting/fetch-all`);
        const accountData = await accountRes.json();
        setAccounts(accountData.count || 0);

        const consignmentRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/loanamount`);
        const consignmentData = await consignmentRes.json();
        const loansData = consignmentData.loans;

        const [perTripRes, perMonthRes, perYearRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/rate-per-mile`),
          fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/rate-per-month`),
          fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/rate-per-year`),
        ]);

        const [perTripData, perMonthData, perYearData] = await Promise.all([perTripRes.json(), perMonthRes.json(), perYearRes.json()]);

        if (Array.isArray(loansData)) {
          const paidData = loansData.map((item) => item.totalPaid || 0);
          const unpaidData = loansData.map((item) => item.totalUnpaid || 0);

          loansData.forEach(item => {
            const loanDate = new Date(item.date);
            const monthIndex = loanDate.getMonth();
            const totalPaid = item.status === 'paid' ? parseFloat(item.total_payment) : 0;
            const totalUnpaid = item.status === 'unpaid' ? parseFloat(item.total_payment) : 0;

            paidData[monthIndex] += totalPaid;
            unpaidData[monthIndex] += totalUnpaid;
          });

          setConsigData({
            labels: [
              'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ],
            datasets: [
              {
                label: 'Total Paid',
                data: paidData,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                fill: true,
              },
              {
                label: 'Total Unpaid',
                data: unpaidData,
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                fill: true,
              }
            ]
          });
        }

        setChartData({
          labels: ['Receivables', 'Total Budget Request', 'Total Transactions', 'Accounts'],
          datasets: [
            {
              label: 'Financial Overview',
              data: [receivables, totalBudgetRequest, transactions, accounts],
              backgroundColor: ['#3b82f6', '#10b981', '#fbbf24', '#ef4444'],
              borderColor: ['#2563eb', '#059669', '#f59e0b', '#dc2626'],
              borderWidth: 1,
            },
          ],
        });

        setInhouseData({
          labels: ['Per Trip', 'Per Month', 'Per Year'],
          datasets: [
            {
              label: 'Inhouse Report',
              data: [
                perTripData.rates.reduce((sum: number, rate: { earnings_per_trip: number }) => sum + rate.earnings_per_trip, 0),
                perMonthData.rates.length,
                perYearData.yearlyTotal,
              ],
              backgroundColor: ['#10b981', '#fbbf24', '#3b82f6'], 
              borderColor: ['#059669', '#f59e0b', '#2563eb'],   
              borderWidth: 1,
            },
          ],
        });

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [receivables, totalBudgetRequest, transactions, accounts]);

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="flex items-center justify-between p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
            <CurrencyDollarIcon className="h-8 w-8 text-blue-500 dark:text-blue-300" />
            <div className="">
              <h1 className="font-semibold text-3xl text-center">{receivables}</h1>
              <h3 className="text-lg font-semibold">Receivables</h3>
            </div>
          </Card>

          <Card className="flex items-center justify-between p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
            <UserIcon className="h-8 w-8 text-green-500 mb-2 dark:text-green-300" />
            <div className="">
              <h1 className="font-semibold text-3xl text-center">{totalBudgetRequest}</h1>
              <h3 className="text-lg font-semibold">Total Budget Request</h3>
            </div>
          </Card>

          <Card className="flex items-center justify-between p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
            <CogIcon className="h-8 w-8 text-yellow-500 mb-2 dark:text-yellow-300" />
            <div className="">
              <h1 className="font-semibold text-3xl text-center">{transactions}</h1>
              <h3 className="text-lg font-semibold">Total Transactions</h3>
            </div>
          </Card>

          <Card className="flex items-center justify-between p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
            <BriefcaseIcon className="h-8 w-8 text-red-500 mb-2 dark:text-red-300" />
            <div className="">
              <h1 className="font-semibold text-3xl text-center">{accounts}</h1>
              <h3 className="text-lg font-semibold">Accounts</h3>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-10 ">
          <div className="col-span-1">
            <h2 className="text-2xl font-semibold">Financial Overview</h2>
            <Bar data={chartData} />
          </div>

          <div className="col-span-1">
            <h2 className="text-2xl font-semibold">In-House Report</h2>
            <Bar data={inhouseData} />
          </div>
        </div>

        <div className="mt-10 ">
          <h2 className="text-2xl font-semibold">Consignment Data</h2>
          <Line data={consigData} />
        </div>
      </div>
    </div>
  );
};

export default AccountingDashboard;
