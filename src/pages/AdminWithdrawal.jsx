import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  runTransaction,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import Loading from "../components/loading";
import "../styles/AdminWithdrawals.css";
import toast from "react-hot-toast";

export default function AdminWithdrawal() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  async function fetchRequests() {
    setLoading(true);
    try {
      const q = query(
        collection(db, "withdrawalRequests"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => {
        const requestData = doc.data();
        const fullName = `${requestData.firstName || ""} ${
          requestData.lastName || ""
        }`.trim();
        return {
          id: doc.id,
          ...requestData,
          fullName: fullName || "Unknown User",
        };
      });

      setRequests(data);
    } catch (error) {
      console.error("Error fetching withdrawal requests:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  async function handleApprove(request) {
    setProcessingId(request.id);

    const userRef = doc(db, "users", request.userId);
    const requestRef = doc(db, "withdrawalRequests", request.id);
    const transactionsRef = collection(db, "transactions");

    try {
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) {
          throw new Error("User not found.");
        }

        const userData = userDoc.data();
        const currentBalance = userData.balance || 1000000;

        if (request.amount > currentBalance) {
          throw new Error("User has insufficient funds.");
        }

        transaction.update(userRef, {
          balance: currentBalance - request.amount,
        });

        const newTransactionRef = doc(transactionsRef);
        transaction.set(newTransactionRef, {
          userId: request.userId,
          amount: request.amount,
          type: "withdrawal",
          timestamp: serverTimestamp(),
          fullName:
            `${request.firstName || ""} ${request.lastName || ""}`.trim() ||
            "Unknown User",
          email: request.email || "no-email@example.com",
        });

        transaction.update(requestRef, { status: "approved" });
      });

      toast.success("Withdrawal approved and processed!");
      fetchRequests();
    } catch (error) {
      console.error("Approval failed:", error);
      toast.error(`Approval failed: ${error.message}`);
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(requestId) {
    setProcessingId(requestId);

    try {
      await updateDoc(doc(db, "withdrawalRequests", requestId), {
        status: "rejected",
      });

      setRequests((prevRequests) =>
        prevRequests.filter((req) => req.id !== requestId)
      );

      toast("Withdrawal request rejected.");
    } catch (error) {
      console.error("Rejection failed:", error);
      toast.error(`Rejection failed: ${error.message}`);
    } finally {
      setProcessingId(null);
    }
  }
  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  });

  if (loading)
    return (
      <div className="loader-container">
        <Loading />
      </div>
    );
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Withdrawal Dashboard</h1>
      {requests.length === 0 && <p>No withdrawal requests found.</p>}

      <div className="request-grid">
        {requests
          .filter((req) => req.status !== "rejected")
          .map((req) => (
            <div key={req.id} className="request-card">
              <p className="request-user">
                <strong>User:</strong> {req.fullName || "N/A"} (
                {req.email || "no-email@gmail.com"})
              </p>

              <p>
                <strong>Amount:</strong> {formatter.format(req.amount)}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span className={`status ${req.status}`}>{req.status}</span>
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {req.timestamp?.toDate
                  ? req.timestamp.toDate().toLocaleString()
                  : "N/A"}
              </p>

              {req.status === "pending" && (
                <div className="request-actions">
                  <button
                    onClick={() => handleApprove(req)}
                    className="button-approve"
                    disabled={processingId === req.id}
                  >
                    {processingId === req.id ? "Processing..." : "Approve"}
                  </button>
                  <button
                    onClick={() => handleReject(req.id)}
                    className="button-reject"
                    disabled={processingId === req.id}
                  >
                    {processingId === req.id ? "Processing..." : "Reject"}
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
