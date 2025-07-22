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
        setBalance(data.balance || "");

        setUserInfo({
          userName: data.fullName || "Unknown User",
          email: data.email || "no-email@example.com",
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

          // ✳ Fetch matching admin feedback
          const adminRef = doc(db, "adminWithdrawal", docSnap.id);
          const adminSnap = await getDoc(adminRef);

          if (adminSnap.exists()) {
            const adminData = adminSnap.data();
            withdrawal.adminFeedback = adminData.feedback || "";
            withdrawal.status = adminData.status || withdrawal.status;
          }

          updatedWithdrawals.push(withdrawal);

          // Deduct if accepted and not yet deducted
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

      toast.success("Withdrawal request submitted.");
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
      <h2>Withdraw Funds</h2>

      {userId ? (
        <>
          <form onSubmit={handleWithdrawal}>
            <div>
              <h3 className="walletDigit">{formatter.format(balance)}</h3>

              <p className="walletCategory">
                {" "}
                <AccountBalanceWalletIcon /> Your current account balance
              </p>
            </div>

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
            <label htmlFor="amount">Amount to Withdraw</label>
            <button type="submit" disabled={formLoading}>
              {formLoading ? "Processing..." : "Submit Request"}
            </button>
          </form>

          <h3>Your Withdrawal History</h3>
          {loading ? (
            <p>Loading...</p>
          ) : withdrawals.length === 0 ? (
            <p>No withdrawals yet.</p>
          ) : (
            withdrawals.map((w) => (
              <div key={w.id} className="withdrawal-record">
                <p>
                  <strong>Amount:</strong> {formatter.format(w.amount)}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      color:
                        w.status === "pending"
                          ? "orange"
                          : w.status === "accepted"
                          ? "green"
                          : "red",
                    }}
                  >
                    {w.status.toUpperCase()}
                  </span>
                </p>
                {w.adminFeedback && (
                  <p
                    style={{
                      marginTop: "5px",
                      color: "#666",
                      fontStyle: "italic",
                    }}
                  >
                    <strong>Admin:</strong> {w.adminFeedback}
                  </p>
                )}
                <p>
                  <strong>Date:</strong>{" "}
                  {w.timestamp?.toDate
                    ? w.timestamp.toDate().toLocaleString()
                    : "N/A"}
                </p>
              </div>
            ))
          )}
        </>
      ) : (
        <p>Please log in to make a withdrawal.</p>
      )}
    </div>
  );
}
