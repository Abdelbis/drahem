import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useTransactions } from "@/hooks/useTransactions";

const BalanceCard: React.FC = () => {
  const { summary } = useTransactions();
  
  const getFinancialStatus = () => {
    if (summary.balance > 0) return "Bon";
    if (summary.balance === 0) return "Moyen";
    return "À améliorer";
  };

  const getStatusColor = () => {
    if (summary.balance > 0) return "text-green-500";
    if (summary.balance === 0) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-white">
          Solde actuel
        </CardTitle>
        <p className="text-sm text-gray-400">
          {format(new Date(), "d MMMM yyyy", { locale: fr })}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="text-3xl font-bold text-white">
            {summary.balance.toLocaleString('fr-DZ')} <span className="text-lg">DZD</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <div className="flex flex-col">
              <span className="text-gray-400">Revenus</span>
              <span className="font-medium text-green-500">
                +{summary.totalIncome.toLocaleString('fr-DZ')} DZD
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-gray-400">Dépenses</span>
              <span className="font-medium text-red-500">
                -{summary.totalExpenses.toLocaleString('fr-DZ')} DZD
              </span>
            </div>
          </div>
          
          <div className="pt-2 border-t border-gray-800">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">État financier</span>
              <span className={`font-medium ${getStatusColor()}`}>
                {getFinancialStatus()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;