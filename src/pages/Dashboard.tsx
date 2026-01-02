import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import BalanceCard from "@/components/BalanceCard";
import SummaryCards from "@/components/SummaryCards";
import FinancialChart from "@/components/FinancialChart";
import CategoryChart from "@/components/CategoryChart";
import TransactionList from "@/components/TransactionList";
import TransactionForm from "@/components/TransactionForm";
import MotivationalMessage from "@/components/MotivationalMessage";
import { Transaction } from "@/types";

const Dashboard: React.FC = () => {
  const { getFinancialSummary } = useTransactions();
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  const summary = getFinancialSummary();

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Mon Budget</h1>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <BalanceCard summary={summary} />
          </div>
          <div className="lg:col-span-1">
            <MotivationalMessage />
          </div>
        </div>
        
        <SummaryCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
          <FinancialChart />
          <CategoryChart />
        </div>
        
        <TransactionList onEdit={handleEdit} />
      </div>
      
      <TransactionForm 
        open={showForm} 
        onOpenChange={setShowForm} 
      />
    </div>
  );
};

export default Dashboard;