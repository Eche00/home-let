import { useState, useEffect } from "react";
import { db, auth } from "../lib/firebase";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  addDoc,
  orderBy,
  serverTimestamp,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "../styles/Withdrawal.css";
import toast from "react-hot-toast";
import MiniDash from "../dashboards/MiniDash";
import depositImg from "../assets/hand.png";
import Wallet from "../dashboards/DashboardContent/Wallet";

export default function Withdrawal() {
  const [amount, setAmount] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);
  const [balance, setBalance] = useState(0);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchUserData(user.uid);
        listenToWithdrawals(user.uid);
      } else {
        setUserId(null);
        setBalance(0);
        setUserInfo({});
        setWithdrawals([]);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeWithdrawals) unsubscribeWithdrawals();
    };
  }, []);

  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  });

  let unsubscribeWithdrawals = null;

  async function fetchUserData(uid) {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setBalance(data.balance || 0);

        setUserInfo({
          userName: data.fullName || "Unknown User",
          email: data.email || "no-email@example.com",
          bankName: data.bankName || "N/A",
          accountNumber: data.accountNumber || "N/A",
          accountHolderName: data.accountHolderName || "N/A",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }

  function listenToWithdrawals(uid) {
    const withdrawalRef = query(
      collection(db, "withdrawalRequests"),
      where("userId", "==", uid),
      orderBy("timestamp", "desc")
    );

    unsubscribeWithdrawals = onSnapshot(
      withdrawalRef,
      async (snapshot) => {
        const updatedWithdrawals = [];

        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();
          const withdrawal = { id: docSnap.id, ...data };

          // Auto-deduct if approved but not yet deducted
          if (withdrawal.status === "accepted" && !withdrawal.deducted) {
            const newUserBalance = balance - withdrawal.amount;

            await updateDoc(doc(db, "withdrawalRequests", docSnap.id), {
              deducted: true,
            });

            await updateDoc(doc(db, "users", uid), {
              balance: newUserBalance,
            });

            setBalance(newUserBalance);
          }

          updatedWithdrawals.push(withdrawal);
        }

        setWithdrawals(updatedWithdrawals);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to withdrawals:", error);
        setLoading(false);
      }
    );
  }

  async function handleWithdrawal(e) {
    e.preventDefault();
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }
    if (value > balance) {
      toast.error("Insufficient balance.");
      return;
    }

    setFormLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Not authenticated.");
        return;
      }

      const newRequest = {
        userId: user.uid,
        amount: value,
        type: "withdrawal",
        status: "pending",
        deducted: false,
        timestamp: serverTimestamp(),
        userName: userInfo.userName || "Unknown User",
        email: userInfo.email || "no-email@example.com",
      };

      await addDoc(collection(db, "withdrawalRequests"), newRequest);

      toast.success(
        "Withdrawal request submitted. Your transaction requires manual approval. You will be notified once it's processed."
      );
      setAmount("");
    } catch (error) {
      console.error("Withdrawal failed:", error);
      toast.error("Error submitting withdrawal.");
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <div className="withdrawal-container">
      <div className="walletContainer">
        <div className="wallet">
          <Wallet />
        </div>
        <div className="mini-profile">
          <MiniDash />
        </div>
      </div>

      {userId ? (
        <div className="depositContainer">
          <div className="depositFormContainer">
            <form onSubmit={handleWithdrawal}>
              <input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
                disabled={formLoading}
              />

              <div className="bank-info" style={{ marginTop: "0.1rem" }}>
                <h4>
                  You are withdrawing to the details below:
                </h4>
                <p><strong>Bank Name:</strong> {userInfo.bankName}</p>
                <p><strong>Account Number:</strong> {userInfo.accountNumber}</p>
                <p><strong>Account Holder Name:</strong> {userInfo.accountHolderName}</p>
              </div>

              <button type="submit" disabled={formLoading}>
                {formLoading ? "Processing..." : "Submit Request"}
              </button>
            </form>
          </div>
          <div className="depositImgContainer">
            <img src={depositImg} alt="/" className="depositImg" />
          </div>
        </div>
      ) : (
        <p>Please log in to make a withdrawal.</p>
      )}
    </div>
  );
}
