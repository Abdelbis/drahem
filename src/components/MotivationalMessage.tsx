import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useTransactions } from "@/hooks/useTransactions";

const motivationalMessages = [
  "Bravo ! Vous gérez bien vos finances cette semaine.",
  "Continuez comme ça ! Votre discipline financière porte ses fruits.",
  "Excellent travail ! Vos efforts d'épargne commencent à payer.",
  "Félicitations ! Vous êtes sur la bonne voie pour atteindre vos objectifs.",
  "Impressionnant ! Votre gestion budgétaire est exemplaire.",
  "Bien joué ! Chaque dinar économisé vous rapproche de vos rêves.",
  "Super ! Votre discipline financière inspire les autres.",
  "Magnifique ! Vous transformez vos habitudes financières en résultats.",
  "Génial ! Votre approche méthodique de la gestion financière porte ses fruits.",
  "Exceptionnel ! Vous maîtrisez l'art de l'équilibre financier."
];

const MotivationalMessage: React.FC = () => {
  const [message, setMessage] = useState("");
  const { getFinancialSummary } = useTransactions();
  const summary = getFinancialSummary();

  useEffect(() => {
    // Select a random message
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
    setMessage(motivationalMessages[randomIndex]);
  }, []);

  // Show special message if user is doing well
  const getSpecialMessage = () => {
    if (summary.balance > 0) {
      return "Bravo, vous avez économisé ce mois-ci ! Continuez sur cette lancée.";
    }
    if (summary.balance < 0) {
      return "Attention, vos dépenses dépassent vos revenus. Essayez de réduire vos dépenses.";
    }
    return "Bon équilibre financier ! Continuez à maintenir cet équilibre.";
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-white text-lg">💡</span>
          </div>
          <div>
            <p className="text-white font-medium">
              {summary.balance !== 0 ? getSpecialMessage() : message}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MotivationalMessage;