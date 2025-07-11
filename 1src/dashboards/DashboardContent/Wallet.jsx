import React, { useEffect, useState } from "react";
import { db, auth } from "../../lib/firebase"; // Import your Firebase Auth
import { collection, getDocs, query, where } from "firebase/firestore";
import "../../styles/Wallet.css";

function Wallet() {
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);
  const [balance, setBalance] = useState(0);

  // Get the currently logged-in user
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchTransactions = async () => {
      if (currentUser) {
        try {
          // Get transactions where userId matches the logged-in user
          const transactionsQuery = query(
            collection(db, "transactions"),
            where("userId", "==", currentUser.uid) // Access the user ID directly
          );
          const transactionSnapshot = await getDocs(transactionsQuery);

          let credit = 0;
          let debit = 0;

          transactionSnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.type === "credit") {
              credit += data.amount;
            } else if (data.type === "debit") {
              debit += data.amount;
            }
          });

          setTotalCredit(credit);
          setTotalDebit(debit);
          setBalance(credit - debit);
        } catch (error) {
          console.error("Error fetching transactions:", error);
        }
      }
    };

    fetchTransactions();
  }, [currentUser]);

  
  return (
    <div className="walletSubContainer">
      <div className="walletBalance">
        <h3 className="walletDigit">NGN {balance.toFixed(2)}</h3>
        <p className="walletCategory">Balance</p>
      </div>
      <div className="walletCredit">
        <h3 className="walletDigit">NGN {totalCredit.toFixed(2)}</h3>
        <p className="walletCategory">Income</p>
      </div>
      <div className="walletDebit">
        <h3 className="walletDigit">NGN {totalDebit.toFixed(2)}</h3>
        <p className="walletCategory">Expense</p>
      </div>
    </div>
  );
}

export default Wallet;
