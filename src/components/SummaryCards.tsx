import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactions } from "@/hooks/useTransactions";

const SummaryCards: React.FC = () => {
  const { getDailySummary, getWeeklySummary, getMonthlySummary } = useTransactions();
  
  const daily = getDailySummary();
  const weekly = getWeeklySummary();
  const monthly = getMonthlySummary();

  const summaryData = [
    {
      title: "Aujourd'hui",
      income: daily.income,
      expenses: daily.expenses,
      period: "day"
    },
    {
      title: "Cette semaine",
      income: weekly.income,
      expenses: weekly.expenses,
      period: "week"
    },
    {
      title: "Ce mois",
      income: monthly.income,
      expenses: monthly.expenses,
      period: "month"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {summaryData.map((data, index) => (
        <Card key={index} className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-white">
              {data.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Revenus</span>
                <span className="font-medium text-green-500">
                  +{data.income.toLocaleString('fr-DZ')} DZD
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Dépenses</span>
                <span className="font-medium text-red-500">
                  -{data.expenses.toLocaleString('fr-DZ')} DZD
                </span>
              </div>
              <div className="pt-2 border-t border-gray-800 flex justify-between">
                <span className="text-gray-400">Différence</span>
                <span className={`font-medium ${
                  data.income - data.expenses >= 0 
                    ? 'text-green-500' 
                    : 'text-red-500'
                }`}>
                  {(data.income - data.expenses).toLocaleString('fr-DZ')} DZD
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SummaryCards;