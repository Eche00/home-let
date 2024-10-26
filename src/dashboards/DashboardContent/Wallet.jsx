import React from "react";
import "../../styles/Wallet.css";

function Wallet() {
  return (
    <div className="walletSubContainer">
      <div className="walletCredit">
        <h3 className="walletDigit">1,373,733</h3>
        <p className="walletCategory">Income</p>
      </div>
      <div className="walletDebit">
        <h3 className="walletDigit">1,373,733</h3>
        <p className="walletCategory">Expense</p>
      </div>
      <div className="walletBalance">
        <h3 className="walletDigit">1,373,733</h3>
        <p className="walletCategory">Balance</p>
        <button className="walletDetail">&rarr;</button>
      </div>
    </div>
  );
}

export default Wallet;
