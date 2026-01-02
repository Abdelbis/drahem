import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTransactions } from "@/hooks/useTransactions";
import { allCategories, expenseCategories, incomeCategories } from "@/data/categories";
import { toast } from "sonner";

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ open, onOpenChange }) => {
  const { addTransaction } = useTransactions();
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [note, setNote] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  const categories = type === 'expense' ? expenseCategories : incomeCategories;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    const amountValue = parseFloat(amount.replace(',', '.'));
    
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error("Veuillez entrer un montant valide");
      return;
    }
    
    addTransaction({
      type,
      amount: amountValue,
      category,
      date,
      note: note || undefined
    });
    
    // Reset form
    setAmount('');
    setCategory('');
    setNote('');
    setDate(new Date());
    
    toast.success(`Transaction ${type === 'expense' ? 'dépense' : 'revenu'} ajoutée avec succès`);
    onOpenChange(false);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal separator
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setAmount(value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">
            Ajouter une transaction
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={type === 'expense' ? "default" : "outline"}
              className={cn(
                "flex-1",
                type === 'expense' ? "bg-red-500 hover:bg-red-600" : "border-gray-700 text-gray-300"
              )}
              onClick={() => setType('expense')}
            >
              Dépense
            </Button>
            <Button
              type="button"
              variant={type === 'income' ? "default" : "outline"}
              className={cn(
                "flex-1",
                type === 'income' ? "bg-green-500 hover:bg-green-600" : "border-gray-700 text-gray-300"
              )}
              onClick={() => setType('income')}
            >
              Revenu
            </Button>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Montant (DZD)
            </label>
            <div className="relative">
              <Input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0,00"
                className="text-2xl h-14 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                DZD
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Catégorie
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {categories.map((cat) => (
                  <SelectItem 
                    key={cat.id} 
                    value={cat.id}
                    className="text-white focus:bg-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Date
            </label>
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-gray-800 border-gray-700 text-white hover:bg-gray-700",
                  !date && "text-muted-foreground"
                )}
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
              </Button>
              
              {showCalendar && (
                <div className="absolute z-10 mt-2 bg-gray-800 border border-gray-700 rounded-md p-3">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      if (newDate) {
                        setDate(newDate);
                        setShowCalendar(false);
                      }
                    }}
                    locale={fr}
                    className="bg-gray-800 text-white"
                    classNames={{
                      day_selected: "bg-blue-500 text-white hover:bg-blue-600",
                      day_today: "bg-gray-700 text-white",
                      day: "text-white hover:bg-gray-700"
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Note (optionnelle)
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ajouter une note..."
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
          
          <Button 
            type="submit" 
            className={cn(
              "w-full",
              type === 'expense' 
                ? "bg-red-500 hover:bg-red-600" 
                : "bg-green-500 hover:bg-green-600"
            )}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;