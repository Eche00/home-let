import { useEffect, useState } from "react";
import "../styles/VendorList.css";
import { db } from "../lib/firebase";
import { toast } from "react-hot-toast";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import Loading from "../components/loading";

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "vendors"));
        const vendorList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVendors(vendorList);
      } catch (err) {
        console.error("Fetch failed:", err.message);
        toast.error("Failed to fetch vendors!");
        setError("Failed to fetch vendors");
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  const fetchVendorDetails = async (vendorId) => {
    const toastId = toast.loading("Fetching vendor details...");
    try {
      const docRef = doc(db, "vendors", vendorId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSelectedVendor({ id: vendorId, ...docSnap.data() });
        toast.success("Vendor details loaded.", { id: toastId });
        setShowModal(true);
      } else {
        toast.error("Vendor details not found.", { id: toastId });
        setError("Vendor details not found.");
      }
    } catch (err) {
      console.error("Fetch failed:", err.message);
      toast.error("Failed to fetch vendor details.", { id: toastId });
      setError("Failed to fetch vendor details.");
    }
  };

  const approveVendor = async (vendorId) => {
    const toastId = toast.loading("Approving vendor...");
    try {
      const vendorRef = doc(db, "vendors", vendorId);
      await updateDoc(vendorRef, { status: "approved" });
      setVendors((prev) =>
        prev.map((vendor) =>
          vendor.id === vendorId ? { ...vendor, status: "approved" } : vendor
        )
      );
      toast.success("Vendor approved successfully!", { id: toastId });
    } catch (error) {
      console.error("Error approving vendor:", error.message);
      toast.error("Failed to approve vendor.", { id: toastId });
    }
  };

  const rejectVendor = async (vendorId) => {
    const toastId = toast.loading("Rejecting vendor...");
    try {
      const vendorRef = doc(db, "vendors", vendorId);
      await deleteDoc(vendorRef);
      setVendors((prev) => prev.filter((vendor) => vendor.id !== vendorId));
      toast.success("Vendor rejected and removed.", { id: toastId });
    } catch (error) {
      console.error("Error rejecting vendor:", error.message);
      toast.error("Failed to reject vendor.", { id: toastId });
    }
  };

  if (loading)
    return (
      <div className="loader-container">
        <Loading />
      </div>
    );
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="vendor-list-container">
      <h1 className="vendor-list-title">Vendor List</h1>
      <div className="vendor-table-container">
        <table className="vendor-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id}>
                <td data-label="Name" className="td">
                  {vendor.fullName}
                </td>
                <td data-label="Email" className="td">
                  {vendor.email}
                </td>
                <td data-label="Phone Number" className="td">
                  {vendor.number}
                </td>
                <td
                  data-label="Status"
                  className={`vendor-status ${vendor.status}`}
                >
                  {vendor.status}
                </td>
                <td data-label="Actions" className="vendor-actions">
                  <div className="dropdown">
                    <button className="dropdown-toggle">Actions ▾</button>
                    <div className="dropdown-menu">
                      <button
                        className="approve"
                        onClick={() => approveVendor(vendor.id)}
                        disabled={vendor.status === "approved"}
                      >
                        {vendor.status === "approved" ? "Approved" : "Approve"}
                      </button>
                      <button
                        className="reject"
                        onClick={() => rejectVendor(vendor.id)}
                        disabled={vendor.status === "rejected"}
                      >
                        {vendor.status === "rejected" ? "Rejected" : "Reject"}
                      </button>
                      <button
                        className="details"
                        onClick={() => fetchVendorDetails(vendor.id)}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedVendor && (
        <div className="modal">
          <div className="modal-content">
            <h2>
              {selectedVendor.fullName}
              {"'"}s Details
            </h2>
            <p>
              <strong>Email:</strong> {selectedVendor.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedVendor.number}
            </p>
            <p>
              <strong>Location:</strong> {selectedVendor.location || "N/A"}
            </p>
            <p>
              <strong>Business Name:</strong>{" "}
              {selectedVendor.businessName || "N/A"}
            </p>
            <p>
              <strong>Business Description:</strong>{" "}
              {selectedVendor.businessDescription || "N/A"}
            </p>
            <button onClick={() => setShowModal(false)}>X</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorList;
