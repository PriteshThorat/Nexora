import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../components/Header";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function BankAccountsPage() {
  const navigate = useNavigate();
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    email_id: "",
    pin: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAccountId, setDeletingAccountId] = useState(null);
  const [deletePin, setDeletePin] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchBankAccounts();
  }, []);

  const fetchBankAccounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/bank-accounts`, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBankAccounts(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching bank accounts:", err);
      setErrorMessage("Failed to load bank accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/bank-accounts/connect`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email_id: formData.email_id,
            pin: formData.pin,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Bank account connected successfully!");
        setFormData({
          email_id: "",
          pin: "",
        });
        setShowAddForm(false);
        fetchBankAccounts();
      } else {
        setErrorMessage(
          data.error || data.message || "Failed to connect bank account",
        );
      }
    } catch (err) {
      console.error("Error adding bank account:", err);
      setErrorMessage("Error connecting bank account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = (bankId) => {
    setDeletingAccountId(bankId);
    setDeletePin("");
    setShowDeleteModal(true);
    setErrorMessage("");
  };

  const handleConfirmDelete = async () => {
    if (!deletePin) {
      setErrorMessage("Please enter PIN");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/bank-accounts/${deletingAccountId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pin: deletePin,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Bank account removed successfully!");
        setShowDeleteModal(false);
        setDeletingAccountId(null);
        setDeletePin("");
        fetchBankAccounts();
      } else {
        setErrorMessage(
          data.message || data.error || "Failed to remove bank account",
        );
      }
    } catch (err) {
      console.error("Error deleting bank account:", err);
      setErrorMessage("Error removing bank account");
    }
  };

  const theme = {
    bg: darkMode ? "bg-slate-900" : "bg-white",
    cardBg: darkMode ? "bg-slate-800" : "bg-white",
    border: darkMode ? "border-slate-700" : "border-slate-200",
    text: darkMode ? "text-slate-100" : "text-gray-900",
    textSecondary: darkMode ? "text-slate-400" : "text-gray-600",
    input: darkMode
      ? "bg-slate-700 text-slate-100 border-slate-600"
      : "bg-white text-gray-900 border-slate-300",
  };

  return (
    <>
      <Header />
      <div
        className={`min-h-screen ${darkMode ? "bg-slate-900" : "bg-white"} pt-8 pb-16`}
        style={{ fontFamily: "'Roboto Mono', monospace" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-600 dark:text-green-400">
              {successMessage}
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Form Section */}
            <div>
              <h2
                className={`text-xl font-semibold mb-6 ${
                  darkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              >
                Add New Bank Account
              </h2>
              <div
                className={`rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl border transition-colors ${
                  darkMode
                    ? "bg-slate-800 border-slate-700"
                    : "bg-gray-50 border-slate-200"
                }`}
              >
                <form onSubmit={handleAddAccount} className="space-y-6">
                  {errorMessage && (
                    <div
                      className={`border p-4 rounded-lg ${
                        darkMode
                          ? "bg-red-900/20 border-red-800/30 text-red-400"
                          : "bg-red-50 border-red-200 text-red-600"
                      }`}
                    >
                      {errorMessage}
                    </div>
                  )}

                  {/* Email ID */}
                  <div>
                    <label
                      htmlFor="email_id"
                      className={`block font-medium text-sm mb-2 ${
                        darkMode ? "text-slate-100" : "text-gray-800"
                      }`}
                    >
                      Email ID *
                    </label>
                    <input
                      type="email"
                      id="email_id"
                      name="email_id"
                      value={formData.email_id}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      required
                      className={`w-full p-3 rounded-lg border ${
                        darkMode
                          ? "border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500"
                          : "border-slate-300 bg-white text-gray-800 placeholder-slate-400"
                      } transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20`}
                    />
                  </div>

                  {/* PIN */}
                  <div>
                    <label
                      className={`block font-medium text-sm mb-3 ${
                        darkMode ? "text-slate-100" : "text-gray-800"
                      }`}
                    >
                      PIN *
                    </label>
                    <div className="flex justify-start gap-2 mb-3">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <input
                          key={index}
                          type="password"
                          maxLength="1"
                          value={formData.pin[index] || ""}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            if (value.length <= 1) {
                              const newPin = (formData.pin || "").split("");
                              newPin[index] = value;
                              setFormData({
                                ...formData,
                                pin: newPin.join(""),
                              });

                              // Auto-focus next input
                              if (value && index < 5) {
                                const nextInput = document.getElementById(
                                  `form-pin-${index + 1}`,
                                );
                                if (nextInput) nextInput.focus();
                              }
                            }
                          }}
                          onKeyDown={(e) => {
                            if (
                              e.key === "Backspace" &&
                              !formData.pin[index] &&
                              index > 0
                            ) {
                              const prevInput = document.getElementById(
                                `form-pin-${index - 1}`,
                              );
                              if (prevInput) prevInput.focus();
                            }
                          }}
                          id={`form-pin-${index}`}
                          placeholder="•"
                          className={`w-12 h-12 text-center text-lg font-bold border-2 rounded-lg ${
                            darkMode
                              ? "border-slate-600 bg-slate-900 text-slate-100"
                              : "border-slate-300 bg-white text-gray-800"
                          } transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20`}
                        />
                      ))}
                    </div>
                    <p
                      className={`text-xs ${
                        darkMode ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Enter your 6-digit PIN
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full mt-8 px-8 py-3 text-white font-semibold rounded-lg transition-all ${
                      submitting
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/50"
                    }`}
                    style={{
                      backgroundColor: submitting
                        ? "#94a3b8"
                        : "rgb(102, 126, 234)",
                    }}
                  >
                    {submitting ? "Connecting..." : "Connect Bank Account"}
                  </button>
                </form>
              </div>
            </div>

            {/* Connected Accounts Section */}
            <div>
              <h2
                className={`text-xl font-semibold mb-6 ${
                  darkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              >
                Your Connected Accounts
              </h2>
              <div
                className={`rounded-2xl p-6 shadow-xl border ${
                  darkMode
                    ? "bg-slate-800 border-slate-700"
                    : "bg-gray-50 border-slate-200"
                }`}
              >
                {loading ? (
                  <div
                    className={`text-center py-8 ${
                      darkMode ? "text-slate-400" : "text-gray-600"
                    }`}
                  >
                    Loading your bank accounts...
                  </div>
                ) : bankAccounts.length === 0 ? (
                  <div
                    className={`text-center py-8 ${
                      darkMode ? "text-slate-400" : "text-gray-600"
                    }`}
                  >
                    <p className="mb-2">No bank accounts connected yet</p>
                    <p className="text-sm">
                      Use the form on the left to connect your first account
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bankAccounts.map((account) => (
                      <div
                        key={account.id}
                        className={`p-4 rounded-lg border ${
                          darkMode
                            ? "border-slate-600 bg-slate-700/50"
                            : "border-slate-200 bg-white"
                        } flex items-start justify-between hover:shadow-md transition-shadow`}
                      >
                        <div className="flex-1">
                          <div className="space-y-2">
                            <p
                              className={`text-sm ${
                                darkMode ? "text-slate-400" : "text-gray-600"
                              }`}
                            >
                              <span className="font-semibold">Name:</span>{" "}
                              {account.account_holder_name}
                            </p>
                            <p
                              className={`text-sm ${
                                darkMode ? "text-slate-400" : "text-gray-600"
                              }`}
                            >
                              <span className="font-semibold">
                                Account Name:
                              </span>{" "}
                              {account.account_name || "N/A"}
                            </p>
                            {account.upi_id && (
                              <p
                                className={`text-sm ${
                                  darkMode ? "text-slate-400" : "text-gray-600"
                                }`}
                                style={{ wordBreak: "break-word" }}
                              >
                                <span className="font-semibold">UPI ID:</span>{" "}
                                {account.upi_id}
                              </p>
                            )}
                            {account.email && (
                              <p
                                className={`text-sm ${
                                  darkMode ? "text-slate-400" : "text-gray-600"
                                }`}
                                style={{ wordBreak: "break-word" }}
                              >
                                <span className="font-semibold">Email ID:</span>{" "}
                                {account.email}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteAccount(account.id)}
                          className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors whitespace-nowrap ml-4"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Information Card */}
          <div
            className={`mt-8 p-6 border rounded-xl flex flex-col sm:flex-row items-start gap-4 ${
              darkMode
                ? "bg-indigo-500/10 border-indigo-500/20"
                : "bg-indigo-50 border-indigo-200"
            }`}
          >
            <span className="text-2xl">ℹ️</span>
            <div>
              <h3
                className={`font-semibold mb-2 ${
                  darkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              >
                Why connect your bank account?
              </h3>
              <p
                className={`text-sm leading-relaxed ${
                  darkMode ? "text-slate-400" : "text-gray-600"
                }`}
              >
                Connecting your bank account enables our AI agents to analyze
                your transaction patterns, detect fraud, and provide
                personalized financial advice. All connections are secure and
                encrypted. You can connect multiple accounts and manage them
                anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div
              className={`rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl border transition-colors ${
                darkMode
                  ? "bg-slate-800 border-slate-700"
                  : "bg-white border-slate-200"
              }`}
            >
              <h3
                className={`text-xl font-semibold mb-4 ${
                  darkMode ? "text-slate-100" : "text-gray-800"
                }`}
              >
                Verify PIN to Remove Account
              </h3>
              <p
                className={`text-sm mb-6 ${
                  darkMode ? "text-slate-400" : "text-gray-600"
                }`}
              >
                Enter your PIN to confirm removal of this bank account.
              </p>

              {errorMessage && (
                <div
                  className={`border p-3 rounded-lg mb-4 text-sm ${
                    darkMode
                      ? "bg-red-900/20 border-red-800/30 text-red-400"
                      : "bg-red-50 border-red-200 text-red-600"
                  }`}
                >
                  {errorMessage}
                </div>
              )}

              {/* PIN Input Boxes */}
              <div className="flex justify-center gap-2 mb-6">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    type="password"
                    maxLength="1"
                    value={deletePin[index] || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      if (value.length <= 1) {
                        const newPin = deletePin.split("");
                        newPin[index] = value;
                        setDeletePin(newPin.join(""));

                        // Auto-focus next input
                        if (value && index < 5) {
                          const nextInput = document.getElementById(
                            `pin-${index + 1}`,
                          );
                          if (nextInput) nextInput.focus();
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Backspace" &&
                        !deletePin[index] &&
                        index > 0
                      ) {
                        const prevInput = document.getElementById(
                          `pin-${index - 1}`,
                        );
                        if (prevInput) prevInput.focus();
                      }
                    }}
                    id={`pin-${index}`}
                    placeholder="•"
                    className={`w-12 h-12 text-center text-lg font-bold border-2 rounded-lg ${
                      darkMode
                        ? "border-slate-600 bg-slate-900 text-slate-100"
                        : "border-slate-300 bg-white text-gray-800"
                    } transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20`}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePin("");
                    setErrorMessage("");
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                    darkMode
                      ? "bg-slate-700 hover:bg-slate-600 text-slate-100"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Remove Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default BankAccountsPage;
