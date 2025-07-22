import React, { useEffect, useState } from "react";
import { db, auth } from "../../lib/firebase"; // Import your Firebase Auth
import { collection, getDocs, query, where } from "firebase/firestore";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PaymentIcon from "@mui/icons-material/Payment";
import WalletIcon from "@mui/icons-material/Wallet";
import AddCardIcon from "@mui/icons-material/AddCard";
import "../../styles/Wallet.css";
import depositLogic from "../../lib/depositLogic";

function Wallet() {
  const { balance } = depositLogic();

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
        <h2 className="walletTitle">
          Current Balance{" "}
          <span>
            <WalletIcon fontSize="" />
          </span>
        </h2>
        <div>
          <h3 className="walletDigit">
          ₦  {balance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
          </h3>

          <p className="walletCategory">
            {" "}
            <AccountBalanceWalletIcon /> Your current account balance
          </p>
        </div>
      </div>
    </div>
  );
}

export default Wallet;
