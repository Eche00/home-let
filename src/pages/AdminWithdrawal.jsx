import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // for navigation
import { db } from "../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import Loading from "../components/loading";
import "../styles/AdminWithdrawals.css";
import fiat from "../assets/fiat.png";
import toast from "react-hot-toast";

export default function AdminWithdrawal() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const navigate = useNavigate();

  // Fetch withdrawal requests + user data
  async function fetchRequests() {
    setLoading(true);
    try {
      const q = query(
        collection(db, "withdrawalRequests"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      const data = [];

      for (const docSnap of querySnapshot.docs) {
        const requestData = docSnap.data();
        const userRef = doc(db, "users", requestData.userId);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.exists() ? userSnap.data() : {};

        data.push({
          id: docSnap.id,
          ...requestData,
          fullName: userData.fullName || "Unknown User",
          email: userData.email || "No email",
          balance: userData.balance || 0,
        });
      }

      setRequests(data);
    } catch (error) {
      console.error("Error fetching withdrawal requests:", error);
      toast.error("Error loading requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  // Approve request: Deduct amount from user balance, delete request, then navigate
  async function handleApprove(request) {
    setProcessingId(request.id);
    try {
      const userRef = doc(db, "users", request.userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error("User not found.");
      }

      const userData = userSnap.data();
      const currentBalance = userData.balance || 0;

      if (request.amount > currentBalance) {
        toast.error("User has insufficient balance.");
        setProcessingId(null);
        return;
      }

      const newBalance = currentBalance - request.amount;

      // Update balance
      await updateDoc(userRef, { balance: newBalance });

      // Delete withdrawal request
      await deleteDoc(doc(db, "withdrawalRequests", request.id));

      toast.success("Withdrawal approved and balance updated.");

      // Refresh list (optional, since we navigate away)
      // await fetchRequests();

      // Navigate to user details page
      navigate(`/user/${request.userId}`);
    } catch (error) {
      console.error("Approval error:", error);
      toast.error(`Approval failed: ${error.message}`);
    } finally {
      setProcessingId(null);
    }
  }

  // Reject request: Just delete it
  async function handleReject(requestId) {
    setProcessingId(requestId);
    try {
      await deleteDoc(doc(db, "withdrawalRequests", requestId));
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
      toast.success("Withdrawal request rejected and removed.");
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
      <div>
        <Loading />
      </div>
    );

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Withdrawal Dashboard</h1>
      {requests.length === 0 && (
        <div className="empty-state">
          <p>No withdrawal requests found.</p>
          <img
            src={fiat}
            alt="No requests"
            style={{ maxWidth: "200px", marginTop: "1rem" }}
          />
        </div>
      )}

 <div className="request-grid">
  {requests.map((req) => (
    <div
      key={req.id}
      className="request-card"
      onClick={() => navigate(`/user/${req.userId}`)}
      style={{ cursor: "pointer" }}
    >
      <div className="request-user">
        <h2>{req.fullName}</h2>
        <p>({req.email})</p>
      </div>

      <p>
        <strong>Amount to Withdraw:</strong> {formatter.format(req.amount)}
      </p>

      <p>
        <strong>Current Balance:</strong> {formatter.format(req.balance)}
      </p>

      <p>
        <strong>Date:</strong>{" "}
        {req.timestamp?.toDate
          ? req.timestamp.toDate().toLocaleString()
          : "N/A"}
      </p>

      <div
        className="request-actions"
        onClick={(e) => e.stopPropagation()} // prevent navigation on button click
      >
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
    </div>
  ))}
</div>

    </div>
  );
}
