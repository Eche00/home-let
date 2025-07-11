import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, addDoc, Timestamp, query, where, doc, getDoc } from "firebase/firestore";
import "../styles/TransactionForm.css";
import NotFound from "./NotFound";
import { getAuth } from "firebase/auth";

const TransactionForm = () => {
  const [userRole, setUserRole] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("credit");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("completed");
  const [date, setDate] = useState("");
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Fetch the user's role from Firestore
  useEffect(() => {
    const fetchUserRole = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        } else {
          console.error("User document not found");
        }
      } else {
        console.error("No authenticated user");
      }
    };

    fetchUserRole();
  }, []);

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      const userSnapshot = await getDocs(collection(db, "users"));
      const userList = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    };
    fetchUsers();
  }, []);

  // Fetch user's current balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (selectedUser) {
        const transactionsQuery = query(
          collection(db, "transactions"),
          where("userId", "==", selectedUser)
        );
        const transactionSnapshot = await getDocs(transactionsQuery);
        const totalBalance = transactionSnapshot.docs.reduce((acc, doc) => {
          const data = doc.data();
          return data.type === "credit" ? acc + data.amount : acc - data.amount;
        }, 0);
        setBalance(totalBalance);
      }
    };
    fetchBalance();
  }, [selectedUser]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      alert("Please select a user");
      return;
    }

    setIsLoading(true);

    try {
      await addDoc(collection(db, "transactions"), {
        userId: selectedUser,
        amount: parseFloat(amount),
        type,
        description,
        date: date ? Timestamp.fromDate(new Date(date)) : Timestamp.now(),
        status,
      });
      setShowModal(true);
      setSelectedUser("");
      setAmount("");
      setType("credit");
      setDescription("");
      setStatus("completed");
      setDate("");
    } catch (error) {
      console.error("Error adding transaction: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Close modal and refresh page
  const handleCloseModal = () => {
    setShowModal(false);
    window.location.reload();
  };

  return (
    <>
      {userRole === "admin" ? (
        <div className="transaction-form">
          <h2>Add Transaction</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="user">User</label>
              <select
                id="user"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                required
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName || user.email} - {user.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="amount">Amount</label>
              <input
                type="number"
                id="amount"
                value={amount}
                placeholder="eg. 1000"
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="type">Type</label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
            </div>

            <div>
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                value={description}
                placeholder="eg. Account Deposit"
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div>
              {type === "debit" && parseFloat(amount) > balance && (
                <p className="error-text">
                  Insufficient balance for this debit transaction.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={
                isLoading || (type === "debit" && parseFloat(amount) > balance)
              }
            >
              {isLoading ? "Loading..." : "Add Transaction"}
            </button>
          </form>

          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <h3>Transaction Added Successfully!</h3>
                <button onClick={handleCloseModal}>Close</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <NotFound />
      )}
    </>
  );
};

export default TransactionForm;
