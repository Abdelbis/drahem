import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Trash2, Edit3 } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { allCategories } from "@/data/categories";
import { Transaction } from "@/types";

interface TransactionListProps {
  onEdit: (transaction: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ onEdit }) => {
  const { transactions, deleteTransaction } = useTransactions();
  const [filter, setFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  
  const filteredTransactions = transactions
    .filter(t => filter === 'all' || t.type === filter)
    .filter(t => {
      const now = new Date();
      const transactionDate = new Date(t.date);
      
      switch (timeRange) {
        case 'day':
          return transactionDate.toDateString() === now.toDateString();
        case 'week':
          const startOfWeek = new Date(now);
          const day = startOfWeek.getDay();
          const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
          startOfWeek.setDate(diff);
          startOfWeek.setHours(0, 0, 0, 0);
          return transactionDate >= startOfWeek;
        case 'month':
          return (
            transactionDate.getMonth() === now.getMonth() &&
            transactionDate.getFullYear() === now.getFullYear()
          );
        default:
          return true;
      }
    })
    .slice(0, 10); // Show only last 10 transactions

  const getCategoryInfo = (categoryId: string) => {
    return allCategories.find(c => c.id === categoryId) || {
      name: 'Inconnu',
      icon: '❓'
    };
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Êtes-vous sûr de vouloir supprimer cette transaction ?")) {
      deleteTransaction(id);
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-white">
          Transactions récentes
        </CardTitle>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
            <SelectTrigger className="w-[120px] bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all" className="text-white">Tout</SelectItem>
              <SelectItem value="expense" className="text-white">Dépenses</SelectItem>
              <SelectItem value="income" className="text-white">Revenus</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
            <SelectTrigger className="w-[120px] bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="day" className="text-white">Aujourd'hui</SelectItem>
              <SelectItem value="week" className="text-white">Cette semaine</SelectItem>
              <SelectItem value="month" className="text-white">Ce mois</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucune transaction trouvée
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => {
              const categoryInfo = getCategoryInfo(transaction.category);
              
              return (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-800 hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-xl">
                      {categoryInfo.icon}
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        {categoryInfo.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {format(new Date(transaction.date), "d MMM yyyy", { locale: fr })}
                        {transaction.note && ` • ${transaction.note}`}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className={`font-medium ${
                      transaction.type === 'income' 
                        ? 'text-green-500' 
                        : 'text-red-500'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {transaction.amount.toLocaleString('fr-DZ')} DZD
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white hover:bg-gray-700"
                      onClick={() => onEdit(transaction)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-red-500 hover:bg-gray-700"
                      onClick={(e) => handleDelete(transaction.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionList;