import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BankConnectionForm from "../components/BankConnectionForm";
import type { RootState } from "../store/store.ts";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface BankAccount {
  id: string | number;
  bank_name: string;
  masked_account_number: string;
  account_type: string;
}

function BankConnectionPage() {
  const navigate = useNavigate();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  const fetchBankAccounts = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/bank-accounts`, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBankAccounts(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching bank accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectionSuccess = (): void => {
    fetchBankAccounts();
  };

  const handleDeleteBankAccount = async (bankId: string | number): Promise<void> => {
    if (!window.confirm("Are you sure you want to remove this bank account?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/bank-accounts/${bankId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );

      if (response.ok) {
        fetchBankAccounts();
      }
    } catch (err) {
      console.error("Error deleting bank account:", err);
    }
  };

  const handleSkip = (): void => {
    navigate("/dashboard");
  };

  const handleContinue = (): void => {
    navigate("/dashboard");
  };

  return (
    <>
      <Header />
      <div
        className={`min-h-screen ${darkMode ? "bg-slate-900" : "bg-white"} pt-8 pb-16 font-['Roboto_Mono',monospace] transition-colors`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div
              className={`inline-block ${darkMode ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-50 text-indigo-600"} px-4 py-2 rounded-full text-sm font-semibold mb-4`}
            >
              🏦 03 Connect Your Bank Account
            </div>
            <h1
              className={`text-3xl sm:text-4xl font-bold ${darkMode ? "text-slate-100" : "text-gray-800"} mb-3 tracking-tight`}
            >
              Link Your Bank Accounts
            </h1>
            <p
              className={`${darkMode ? "text-slate-400" : "text-gray-600"} text-base sm:text-lg max-w-2xl mx-auto leading-relaxed`}
            >
              Connect one or more bank accounts to enable fraud detection and
              better financial insights from our AI agents.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Form Section */}
            <div>
              <h2
                className={`text-xl font-semibold mb-6 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}
              >
                Add New Bank Account
              </h2>
              <BankConnectionForm
                onSuccess={handleConnectionSuccess}
                darkMode={darkMode}
              />
            </div>

            {/* Connected Accounts Section */}
            <div>
              <h2
                className={`text-xl font-semibold mb-6 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}
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
                    className={`text-center py-8 ${darkMode ? "text-slate-400" : "text-gray-600"}`}
                  >
                    Loading your bank accounts...
                  </div>
                ) : bankAccounts.length === 0 ? (
                  <div
                    className={`text-center py-8 ${darkMode ? "text-slate-400" : "text-gray-600"}`}
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
                        className={`p-4 rounded-lg border ${darkMode ? "border-slate-600 bg-slate-700/50" : "border-slate-200 bg-white"} flex items-center justify-between`}
                      >
                        <div>
                          <p
                            className={`font-semibold ${darkMode ? "text-slate-100" : "text-gray-800"}`}
                          >
                            {account.bank_name}
                          </p>
                          <p
                            className={`text-sm ${darkMode ? "text-slate-400" : "text-gray-600"}`}
                          >
                            {account.masked_account_number}
                          </p>
                          <p
                            className={`text-xs ${darkMode ? "text-slate-500" : "text-gray-500"}`}
                          >
                            {account.account_type}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteBankAccount(account.id)}
                          className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-slate-300 dark:border-slate-600">
            <button
              onClick={handleSkip}
              className={`px-8 py-3 rounded-lg font-semibold transition-all border ${darkMode ? "border-slate-600 text-slate-400 hover:bg-slate-800" : "border-slate-300 text-gray-700 hover:bg-gray-100"}`}
            >
              Skip for Now
            </button>
            <button
              onClick={handleContinue}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/50"
            >
              Continue to Dashboard
            </button>
          </div>

          {/* Info Card */}
          <div
            className={`mt-8 p-6 border rounded-xl flex flex-col sm:flex-row items-start gap-4 ${darkMode ? "bg-indigo-500/10 border-indigo-500/20" : "bg-indigo-50 border-indigo-200"}`}
          >
            <span className="text-2xl">ℹ️</span>
            <div>
              <h3
                className={`font-semibold mb-2 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}
              >
                Why connect your bank account?
              </h3>
              <p
                className={`text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-gray-600"}`}
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
      </div>
      <Footer />
    </>
  );
}

export default BankConnectionPage;
