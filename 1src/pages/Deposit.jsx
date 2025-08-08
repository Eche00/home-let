import React from "react";
import { PaystackButton } from "react-paystack";
import depositLogic from "../lib/depositLogic";
import "../styles/Deposit.css";
import Wallet from "../dashboards/DashboardContent/Wallet";
import depositImg from "../assets/hand.png";
import MiniDash from "../dashboards/MiniDash";

function Deposit() {
  const { handleDeposit, amount, setAmount, message } = depositLogic();

  return (
    <div className="depositContainerBodys">
      <div className="walletContainer">
        <div className="wallet">
          <Wallet />
        </div>
        <div className="mini-profile">
          {" "}
          <MiniDash />
        </div>
      </div>

      <div className="depositContainer">
        {/* Deposit Form */}

        <section className="depositFormContainer">
          {/* deposit form  */}
          <div className="depositCard">
            {" "}
            <h1 className="transactionHTag">Deposit </h1>
            {/* Transaction amount * */}
            <input
              required
              type="number"
              id="title"
              placeholder="Amount"
              className="depositFormInput"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
            />
            <PaystackButton
              {...handleDeposit}
              className="depositSubmitButton"
              paymentMethod={["bank", "ussd"]}
            />
            {message && <p>{message}</p>}
          </div>
        </section>
        {/* img container  */}
        <section className="depositImgContainer">
          <img src={depositImg} alt="/" className="depositImg" />
        </section>
      </div>
    </div>
  );
}

export default Deposit;
