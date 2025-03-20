'use client'

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@heroui/button";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import ModalComponent from "../Modal";
import { toast, ToastContainer } from "react-toastify";
import Export from "../export";
import RowsPerPage from "@/components/RowsPerPage";

interface Loan {
  date: string;
  borrower: string;
  initial_amount: string;
  interest_percentage: string;
  payment_per_month: string;
  payment_terms: string;
  total_payment: string;
  mode_of_payment: string;
  status: string;
}

interface PMS {
  date: string;
  plate_number: string;
  proof_of_payment: string[];
  parts_replaced: string;
  quantity: number;
  price_parts_replaced: number;
  truck_model: string;
  proof_of_need_to_fixed: string[];
}


interface Account {
  account_id: string;
  account_name: string;
  date: string;
  particulars: string;
  deposit_amount: number;
  withdraw_amount: number;
  notes: string;
  payment_channel: string;
  proof_payment: string[];
  starting_balance: number;
  outstanding_balance: number;
  net_income: number;
}

interface AccountData {
  id: string;
  name: string;
}

interface TransactionFormData {
  account_id: string;
  date: string;
  particulars: string;
  deposit_amount: number;
  notes: string;
  payment_channel: string;
  proof_payment: File | null;
}

interface WithdrawFormData {
  account_id: string;
  date: string;
  particulars: string;
  withdraw_amount: number;
  notes: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("accounts");
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = dateObj.toLocaleString("en-GB", { month: "short" });
    const year = dateObj.getFullYear().toString().slice(-2);
    return `${day} - ${month} - ${year}`;
  };

  // Consign
  const [data, setData] = useState<Loan[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    borrower: "",
    date: "",
    initial_amount: "",
    interest_percentage: "",
    payment_per_month: "",
    payment_terms: "",
    total_payment: "",
    mode_of_payment: "",
  });
  const [formErrors, setFormErrors] = useState({
    borrower: "",
    date: "",
    initial_amount: "",
    interest_percentage: "",
    payment_terms: "",
    mode_of_payment: "",
  });

  // PMS
  const [dataPMS, setDataPMS] = useState<PMS[]>([]);
  const [filterValuePMS, setFilterValuePMS] = useState("");
  const [plateNumbers, setPlateNumbers] = useState<string[]>([]);
  const [isPMSModalOpen, setIsPMSModalOpen] = useState(false);
  const [formDataPMS, setFormDataPMS] = useState({
    plate_number: "",
    truck_model: "",
    parts_replaced: "",
    quantity: "",
    price_parts_replaced: "",
    proof_of_need_to_fixed: "",
    proof_of_payment: "",
  });
  const [errorsPMS, setErrorsPMS] = useState<Record<string, string>>({});

  const validateFormPMS = () => {
    const newErrors: Record<string, string> = {};

    if (!formDataPMS.plate_number) newErrors.plate_number = "Plate Number is required.";
    if (!formDataPMS.truck_model) newErrors.truck_model = "Truck model is required.";
    if (!formDataPMS.parts_replaced) newErrors.parts_replaced = "Parts replaced is required.";
    if (!formDataPMS.quantity || isNaN(Number(formDataPMS.quantity)) || Number(formDataPMS.quantity) <= 0) {
      newErrors.quantity = "Valid quantity is required.";
    }
    if (!formDataPMS.proof_of_need_to_fixed) newErrors.proof_of_need_to_fixed = "Proofs are required.";
    if (!formDataPMS.proof_of_payment) newErrors.proof_of_payment = "Proofs are required.";

    setErrorsPMS(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // Account
  const [dataAcc, setDataAccount] = useState<Account[]>([]);
  const [accountData, setAccountData] = useState<AccountData[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<number | string>('');
  const [accountIds, setAccountIds] = useState<string[]>([]);
  const [filterValueAcc, setFilterValueAcc] = useState("");
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [totalNetIncome, setTotalNetIncome] = useState(0);
  const [transactionData, setTransactionData] = useState<TransactionFormData>({
    account_id: "",
    date: "",
    particulars: "",
    deposit_amount: 0,
    notes: "",
    payment_channel: "",
    proof_payment: null,
  });
  const [errorsTransaction, setErrorsTransaction] = useState<Record<string, string>>({});

  const validateTransactionForm = () => {
    const newErrors: Record<string, string> = {};

    if (!transactionData.account_id) newErrors.account_id = "Account is required.";
    if (!transactionData.date) newErrors.date = "Date is required.";
    if (!transactionData.particulars) newErrors.particulars = "Particulars details are required.";
    if (!transactionData.notes) newErrors.notes = "Notes are required.";
    if (!transactionData.payment_channel) newErrors.payment_channel = "Payment channel is required.";
    if (!transactionData.proof_payment) newErrors.proof_payment = "Proof of payment is required.";
    if (!transactionData.deposit_amount || isNaN(Number(transactionData.deposit_amount)) || Number(transactionData.deposit_amount) <= 0) {
      newErrors.deposit_amount = "Valid deposit amount is required.";
    }

    setErrorsTransaction(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const [withdrawData, setWithdrawData] = useState<WithdrawFormData>({
    account_id: "",
    date: "",
    particulars: "",
    withdraw_amount: 0,
    notes: "",
  });
  const [errorsWithdraw, setErrorsWithdraw] = useState<Record<string, string>>({});
  const validateWithdrawForm = () => {
    const newErrors: Record<string, string> = {};

    if (!withdrawData.account_id) newErrors.account_id = "Account is required.";
    if (!withdrawData.date) newErrors.date = "Date is required.";
    if (!withdrawData.particulars) newErrors.particulars = "Particulars details are required.";
    if (!withdrawData.notes) newErrors.notes = "Notes are required.";
    if (!withdrawData.withdraw_amount || isNaN(Number(withdrawData.withdraw_amount)) || Number(withdrawData.withdraw_amount) <= 0) {
      newErrors.withdraw_amount = "Valid deposit amount is required.";
    }

    setErrorsWithdraw(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const [sortDescriptorAcc, setSortDescriptorAcc] = useState({ column: "date", direction: "ascending" });
  const [sortDescriptorPMS, setSortDescriptorPMS] = useState({ column: "date", direction: "ascending" });
  const [sortDescriptor, setSortDescriptor] = useState({ column: "date", direction: "ascending" });
  const [page, setPage] = useState(1);

  // Consign
  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/loanamount`);
      const result = await response.json();
      setData(result.loans);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Consign
  const handleInputChangeConsign = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };

      const { initial_amount, interest_percentage, payment_terms } = updatedData;

      if (initial_amount && interest_percentage && payment_terms) {
        const principal = parseFloat(initial_amount);
        const annualInterestRate = parseFloat(interest_percentage);
        const months = parseInt(payment_terms);

        const monthlyInterestRate = annualInterestRate / 12 / 100;

        let monthlyPayment = 0;
        if (monthlyInterestRate > 0) {
          monthlyPayment =
            (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) /
            (Math.pow(1 + monthlyInterestRate, months) - 1);
        } else {
          monthlyPayment = principal / months;
        }

        const totalPayment = monthlyPayment * months;

        updatedData.payment_per_month = monthlyPayment.toFixed(2);
        updatedData.total_payment = totalPayment.toFixed(2);
      }

      return updatedData;
    });
  };

  // Consign
  const handleSave = async () => {
    const errors = { ...formErrors };
    let isValid = true;

    if (!formData.borrower) {
      errors.borrower = "Borrower is required";
      isValid = false;
    } else {
      errors.borrower = "";
    }

    if (!formData.date) {
      errors.date = "Date is required";
      isValid = false;
    } else {
      errors.date = "";
    }

    if (!formData.initial_amount || isNaN(parseFloat(formData.initial_amount))) {
      errors.initial_amount = "Initial Amount is required";
      isValid = false;
    } else {
      errors.initial_amount = "";
    }

    if (!formData.interest_percentage || isNaN(parseFloat(formData.interest_percentage))) {
      errors.interest_percentage = "Interest Percentage is required";
      isValid = false;
    } else {
      errors.interest_percentage = "";
    }

    if (!formData.payment_terms || isNaN(parseInt(formData.payment_terms))) {
      errors.payment_terms = "Payment Terms are required";
      isValid = false;
    } else {
      errors.payment_terms = "";
    }

    if (!formData.mode_of_payment) {
      errors.mode_of_payment = "Mode of Payment is required";
      isValid = false;
    } else {
      errors.mode_of_payment = "";
    }

    setFormErrors(errors);

    if (isValid) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/loanamount-store`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          toast.success("Loan data saved successfully!");
          fetchData();
          setIsModalOpen(false);
        } else {
          toast.error("Error saving loan data");
        }
      } catch (error) {
        console.error("Failed to save!:", error);
        toast.error("Failed to save!");
      }
    } else {
      toast.error("Please complete the form");
    }
  };
  // Consign
  const renderCell = (item: Loan, columnKey: keyof Loan) => {
    const value = item[columnKey];

    if (columnKey === "date" && value) {
      const date = new Date(value as string);
      const day = date.getDate().toString().padStart(2, "0");
      const month = date.toLocaleString("en-GB", { month: "short" });
      const year = date.getFullYear().toString().slice(-2);
      return `${day} - ${month} - ${year}`;
    }

    if (["initial_amount", "interest_percentage", "payment_per_month", "total_payment"].includes(columnKey)) {
      const numericValue = parseFloat(value as string);
      if (isNaN(numericValue)) return "-";

      if (columnKey === "interest_percentage") {
        return numericValue.toFixed(2) + "%";
      }

      return numericValue.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
      });
    }

    return value;
  };
  // Consign Filter

  const filteredData = useMemo(() => {
    if (!filterValue.trim()) return data;

    console.log("Filter Value:", filterValue);

    return data.filter((item) => {
      const filterValueStr = filterValue.toLowerCase().trim();

      return [
        item.date,
        item.borrower,
        item.initial_amount,
        item.interest_percentage,
        item.payment_per_month,
        item.payment_terms,
        item.total_payment,
        item.mode_of_payment,
        item.status,
      ]
        .some(field => field?.toString().toLowerCase().includes(filterValueStr));
    });
  }, [data, filterValue]);


  const sortedData = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      const valA = a[sortDescriptor.column as keyof Loan];
      const valB = b[sortDescriptor.column as keyof Loan];
      if (valA < valB) return sortDescriptor.direction === "ascending" ? -1 : 1;
      if (valA > valB) return sortDescriptor.direction === "ascending" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortDescriptor]);

  // Consign PAGINATION
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);




  // PMS
  const fetchDataPMS = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/preventive/maintenance`);
      const result = await response.json();

      const bookingsResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/fetch/plate-numbers`);
      const bookings = await bookingsResponse.json();
      setPlateNumbers(bookings.data.map((booking: any) => booking.plate_number));
      setDataPMS(result.maintenances || []);

      if (result.fileInputValue) {
        setFormData((prev) => ({ ...prev, fileInput: result.fileInputValue }));
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDataPMS();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // PMS INPUT CHANGE
  const handleInputChangePMS = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormDataPMS((prev) => ({ ...prev, [name]: value }));
  };

  // PMS FILE CHANGE
  const handleFileChangePMS = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      setFormDataPMS((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  // PMS SAVE
  const handleSavePMS = async () => {
    if (!validateFormPMS()) {
      // console.log("Validation failed!", formData);
      toast.error("Please input complete details!");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/preventives/store`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataPMS),
        }
      );
      if (response.ok) {
        toast.success("Data saved successfully!");
      } else {
        toast.error("Failed to save data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving data");
    }
    setIsPMSModalOpen(false);
  };

  // PMS Render And PAGINATION
  const filteredDataPMS = useMemo(() => {
    if (!filterValue) return dataPMS;
    return dataPMS.filter((item) =>
      item.plate_number.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [dataPMS, filterValue]);

  const sortedDataPMS = useMemo(() => {
    const sorted = [...filteredDataPMS].sort((a, b) => {
      const valA = a[sortDescriptorPMS.column as keyof PMS];
      const valB = b[sortDescriptorPMS.column as keyof PMS];
      if (valA < valB) return sortDescriptorPMS.direction === "ascending" ? -1 : 1;
      if (valA > valB) return sortDescriptorPMS.direction === "ascending" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredDataPMS, sortDescriptorPMS]);

  const paginatedDataPMS = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedDataPMS.slice(start, start + rowsPerPage);
  }, [sortedDataPMS, page, rowsPerPage]);

  // PMS IMAGE MODAL
  const showImageModal = (path: string) => {
    alert(`Show image: ${path}`);
  };



  // Account
  const fetchAccountData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/accounts`);
      const result = await response.json();
      setAccountData(result.accounts || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAccountData();
    const intervalId = setInterval(fetchAccountData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchDataAcc = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/transactions`);
      const result = await response.json();
      const data = result.data || [];
      setDataAccount(data);

      const accountNameMap = data.reduce((acc: { [key: string]: string }, item: Account) => {
        acc[item.account_id] = item.account_name;
        return acc;
      }, {});

      const balanceMap = data.reduce((acc: { [key: string]: { starting_balance: number, outstanding_balance: number } }, item: Account) => {
        acc[String(item.account_id)] = {
          starting_balance: item.starting_balance,
          outstanding_balance: item.outstanding_balance,
        };
        return acc;
      }, {});

      setAccountIds(accountNameMap);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  useEffect(() => {
    fetchDataAcc();
    const intervalId = setInterval(fetchDataAcc, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleTransactionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTransactionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTransactionFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setTransactionData({
        ...transactionData,
        proof_payment: event.target.files[0],
      });
    }
  };

  const handleWithdrawalInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setWithdrawData((prev) => ({ ...prev, [name]: value }));
  };

  // IN MODAL SAVE
  const handleSaveTransaction = async () => {
    if (!validateTransactionForm()) {
      // console.log("Validation failed!", formData);
      toast.error("Please input complete details!");
      return;
    }
    const formData = new FormData();

    formData.append("account_id", transactionData.account_id);
    formData.append("date", transactionData.date);
    formData.append("particulars", transactionData.particulars);
    formData.append("deposit_amount", String(transactionData.deposit_amount));
    formData.append("notes", transactionData.notes);
    formData.append("payment_channel", transactionData.payment_channel);

    if (transactionData.proof_payment) {
      formData.append("proof_payment", transactionData.proof_payment);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/transactions`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setIsTransactionModalOpen(false);
        setTransactionData({
          account_id: "",
          date: "",
          particulars: "",
          deposit_amount: 0,
          notes: "",
          payment_channel: "",
          proof_payment: null,
        });
        toast.success(result.message || "Transaction added successfully");
        fetchData();
      } else {
        const errorMessages = result.errors ? Object.values(result.errors).join(", ") : "Error adding transaction";
        toast.error(errorMessages);
      }
    } catch (error) {
      console.error("Error saving transaction:", error);
      toast.error("There was an error saving the transaction. Please try again later.");
    }
  };

  // OUT MODAL SAVE
  const handleSaveWithdrawal = async () => {
    if (!validateWithdrawForm()) {
      // console.log("Validation failed!", formData);
      toast.error("Please input complete details!");
      return;
    }
    const formData = new FormData();

    formData.append('account_id', withdrawData.account_id);
    formData.append('date', withdrawData.date);
    formData.append('particulars', withdrawData.particulars);
    formData.append('withdraw_amount', String(withdrawData.withdraw_amount));
    formData.append('notes', withdrawData.notes);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/withdraw`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setIsWithdrawModalOpen(false);
        setWithdrawData({
          account_id: "",
          date: "",
          particulars: "",
          withdraw_amount: 0,
          notes: "",
        });
        toast.success(result.message || 'Withdrawal added successfully');
        fetchDataAcc();
      } else {
        const errorMessages = result.errors ? Object.values(result.errors).join(', ') : 'Error adding withdrawal';
        toast.error(errorMessages);
      }
    } catch (error) {
      console.error('Error saving withdrawal:', error);
      toast.error('There was an error saving the withdrawal. Please try again later.');
    }
  };

  const filteredDataAcc = useMemo(() => {
    if (!filterValueAcc) return dataAcc;

    console.log('Filter Value:', dataAcc);

    const filterValueAccStr = filterValueAcc.toString().toLowerCase().trim();

    return dataAcc.filter((item) => {
      const accountIdStr = item.account_id.toString().toLowerCase().trim();
      console.log('Comparing:', accountIdStr, 'with', filterValueAccStr);
      return accountIdStr === filterValueAccStr;
    });
  }, [dataAcc, filterValueAcc]);


  const sortedDataAcc = useMemo(() => {
    const sorted = [...filteredDataAcc].sort((a, b) => {
      const valA = a[sortDescriptorAcc.column as keyof Account];
      const valB = b[sortDescriptorAcc.column as keyof Account];
      if (valA < valB) return sortDescriptorAcc.direction === "ascending" ? -1 : 1;
      if (valA > valB) return sortDescriptorAcc.direction === "ascending" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredDataAcc, sortDescriptorAcc]);

  const paginatedDataAcc = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedDataAcc.slice(start, start + rowsPerPage);
  }, [sortedDataAcc, page, rowsPerPage]);

  // NET INCOME
  const calculateTotalNetIncome = () => {
    let totalIncome = 0;

    paginatedDataAcc.forEach((item) => {
      totalIncome += item.net_income;
    });

    setTotalNetIncome(totalIncome);
  };

  useEffect(() => {
    calculateTotalNetIncome();
  }, [paginatedDataAcc]);



  return (
    <div className="p-6 bg-white min-h-screen dark:bg-gray-800">
      <div className="lg:flex lg:justify-between gap-2 items-center mb-6 space-y-5 text-center">
        <label className="font-bold text-3xl">Financial Report Table</label>
        <div className="flex gap-1 space-x-2 justify-center">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Manage Account
          </button>

          {isDropdownOpen && (
            <div className="absolute mt-12 w-40 bg-white shadow-lg rounded-lg border border-gray-200 z-10">
              <button
                onClick={() => setIsTransactionModalOpen(true)}
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
              >
                Add Deposit
              </button>
              <button
                onClick={() => setIsWithdrawModalOpen(true)}
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
              >
                Add Expenses
              </button>
            </div>
          )}
          <Button onPress={() => setIsPMSModalOpen(true)} color="primary">
            Add PMS
          </Button>
          <Button onPress={() => setIsModalOpen(true)} color="primary">
            Add Loan
          </Button>
        </div>
      </div>

      {/* Breadcrumb Buttons */}
      <div className="flex space-x-4">
        <button
          className={`${activeTab === "accounts" ? "bg-gray-300 text-black" : "text-blue-600"
            }  px-4 py-2 rounded-md`}
          onClick={() => handleTabClick("accounts")}
        >
          Account
        </button>
        <button
          className={`${activeTab === "preventive-maintenance" ? "bg-gray-300 text-black" : "text-blue-600"
            }  px-4 py-2 rounded-md`}
          onClick={() => handleTabClick("preventive-maintenance")}
        >
          Preventive Maintenance
        </button>
        <button
          className={`${activeTab === "loan" ? "bg-gray-300 text-black" : "text-blue-600"
            }  px-4 py-2 rounded-md font-semibold`}
          onClick={() => handleTabClick("loan")}
        >
          Loan
        </button>
      </div>

      {/* MODAL */}
      {/* Consign */}
      <ModalComponent
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        modalTitle="Loan Form"
        onSave={handleSave}
      >
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(formData).map((key) => (
            <div key={key} className="flex flex-col">
              {key === "mode_of_payment" ? (
                <div>
                  <label htmlFor="mode_of_payment" className="mb-2 text-sm text-gray-700">
                    Select Mode of Payment
                  </label>
                  <select
                    id="mode_of_payment"
                    name="mode_of_payment"
                    value={formData.mode_of_payment}
                    onChange={handleInputChangeConsign}
                    className={`w-full px-4 py-2 border rounded-md ${formErrors.mode_of_payment ? 'border-red-500' : ''}`}
                  >
                    <option value="" disabled selected>Select Mode of Payment</option>
                    <option value="cash">Cash</option>
                    <option value="cheque">Cheque</option>
                  </select>
                  {formErrors.mode_of_payment && <span className="text-red-500 text-sm">{formErrors.mode_of_payment}</span>}
                </div>
              ) : key === "date" ? (
                <div>
                  <label htmlFor="date" className="mb-2 text-sm text-gray-700">
                    Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChangeConsign}
                    className={`w-full px-4 py-2 border rounded-md ${formErrors.date ? 'border-red-500' : ''}`}
                  />
                  {formErrors.date && <span className="text-red-500 text-sm">{formErrors.date}</span>}
                </div>
              ) : key === 'initial_amount' || key === 'interest_percentage' || key === 'payment_terms' ? (
                <div>
                  <label htmlFor={key} className="mb-2 text-sm text-gray-700">
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                  </label>
                  <input
                    type="number"
                    id={key}
                    name={key}
                    value={formData[key as keyof typeof formData]}
                    onChange={handleInputChangeConsign}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      const value = target.value;
                      if (!/^\d*\.?\d*$/.test(value)) {
                        target.value = value.replace(/[^\d\.]/g, '');
                      }
                    }}
                    className={`w-full px-4 py-2 border rounded-md ${formErrors[key as keyof typeof formErrors] ? 'border-red-500' : ''}`}
                  />
                  {formErrors[key as keyof typeof formErrors] && <span className="text-red-500 text-sm">{formErrors[key as keyof typeof formErrors]}</span>}
                </div>
              ) : (
                <div>
                  <label htmlFor={key} className="mb-2 text-sm text-gray-700">
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                  </label>
                  <input
                    type="text"
                    id={key}
                    name={key}
                    value={formData[key as keyof typeof formData]}
                    onChange={handleInputChangeConsign}
                    className={`w-full px-4 py-2 border rounded-md ${formErrors[key as keyof typeof formErrors] ? 'border-red-500' : ''} ${key === 'total_payment' || key === 'payment_per_month' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : ''}`}
                    readOnly={key === 'total_payment' || key === 'payment_per_month'}
                  />
                  {formErrors[key as keyof typeof formErrors] && <span className="text-red-500 text-sm">{formErrors[key as keyof typeof formErrors]}</span>}
                </div>
              )}
            </div>
          ))}

        </div>
      </ModalComponent>

      {/* PMS */}
      <ModalComponent
        isOpen={isPMSModalOpen}
        onOpenChange={setIsPMSModalOpen}
        modalTitle="Add PMS"
        onSave={handleSavePMS}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="plate_number" className="block mb-2 text-sm">
              Plate Number
            </label>
            <select
              id="plate_number"
              name="plate_number"
              value={formDataPMS.plate_number}
              onChange={handleInputChangePMS}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="">Select a Plate Number</option>
              {plateNumbers.map((plate, idx) => (
                <option key={idx} value={plate}>
                  {plate}
                </option>
              ))}
            </select>
            {errorsPMS.plate_number && <p className="text-red-500 text-sm">{errorsPMS.plate_number}</p>}

          </div>
          <div>
            <label htmlFor="truck_model" className="block mb-2 text-sm">
              Truck Model
            </label>
            <input
              id="truck_model"
              type="text"
              name="truck_model"
              value={formDataPMS.truck_model}
              onChange={handleInputChangePMS}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errorsPMS.truck_model && <p className="text-red-500 text-sm">{errorsPMS.truck_model}</p>}
          </div>
          <div>
            <label htmlFor="parts_replaced" className="block mb-2 text-sm">
              Parts Replaced
            </label>
            <input
              id="parts_replaced"
              type="text"
              name="parts_replaced"
              value={formDataPMS.parts_replaced}
              onChange={handleInputChangePMS}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errorsPMS.parts_replaced && <p className="text-red-500 text-sm">{errorsPMS.parts_replaced}</p>}
          </div>
          <div>
            <label htmlFor="quantity" className="block mb-2 text-sm">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              name="quantity"
              value={formDataPMS.quantity}
              onChange={handleInputChangePMS}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errorsPMS.quantity && <p className="text-red-500 text-sm">{errorsPMS.quantity}</p>}
          </div>
          <div>
            <label htmlFor="price_parts_replaced" className="block mb-2 text-sm">
              Price of Parts Replaced
            </label>
            <input
              id="price_parts_replaced"
              type="number"
              name="price_parts_replaced"
              value={formDataPMS.price_parts_replaced}
              onChange={handleInputChangePMS}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errorsPMS.parts_replaced && <p className="text-red-500 text-sm">{errorsPMS.parts_replaced}</p>}
          </div>
          <div>
            <label htmlFor="proof_of_need_to_fixed" className="block mb-2 text-sm">
              Proof of Need to Fixed
            </label>
            <input
              type="file"
              name="proof_of_need_to_fixed"
              multiple
              onChange={handleFileChangePMS}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errorsPMS.proof_of_need_to_fixed && <p className="text-red-500 text-sm">{errorsPMS.proof_of_need_to_fixed}</p>}
          </div>
          <div>
            <label htmlFor="proof_of_payment" className="block mb-2 text-sm">
              Proof of Payment
            </label>
            <input
              type="file"
              name="proof_of_payment"
              multiple
              onChange={handleFileChangePMS}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errorsPMS.proof_of_payment && <p className="text-red-500 text-sm">{errorsPMS.proof_of_payment}</p>}
          </div>
        </div>
      </ModalComponent>

      {/* Account Modal */}
      {/* IN Modal */}
      <ModalComponent
        isOpen={isTransactionModalOpen}
        onOpenChange={setIsTransactionModalOpen}
        modalTitle="Add Transaction"
        onSave={handleSaveTransaction}
      >
        <div className="grid grid-cols-2 gap-4 w-full">
          <div>
            <label htmlFor="account_id" className="block text-sm font-medium">Account</label>
            <select
              name="account_id"
              value={transactionData.account_id}
              onChange={(e) => setTransactionData({ ...transactionData, account_id: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="">Select Account</option>
              {accountData.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            {errorsTransaction.account_id && <p className="text-red-500 text-sm">{errorsTransaction.account_id}</p>}
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={transactionData.date}
              onChange={handleTransactionInputChange}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errorsTransaction.date && <p className="text-red-500 text-sm">{errorsTransaction.date}</p>}
          </div>

          <div>
            <label htmlFor="particulars" className="block text-sm font-medium">Particulars</label>
            <input
              type="text"
              name="particulars"
              value={transactionData.particulars}
              onChange={handleTransactionInputChange}
              placeholder="Particulars"
              className="w-full px-4 py-2 border rounded-md"
            />
            {errorsTransaction.particulars && <p className="text-red-500 text-sm">{errorsTransaction.particulars}</p>}
          </div>

          <div>
            <label htmlFor="deposit_amount" className="block text-sm font-medium">Deposit Amount</label>
            <input
              type="number"
              name="deposit_amount"
              value={transactionData.deposit_amount}
              onChange={handleTransactionInputChange}
              placeholder="Deposit Amount"
              className="w-full px-4 py-2 border rounded-md"
            />
            {errorsTransaction.deposit_amount && <p className="text-red-500 text-sm">{errorsTransaction.deposit_amount}</p>}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium">Notes</label>
            <input
              type="text"
              name="notes"
              value={transactionData.notes}
              onChange={handleTransactionInputChange}
              placeholder="Notes"
              className="w-full px-4 py-2 border rounded-md"
            />
            {errorsTransaction.notes && <p className="text-red-500 text-sm">{errorsTransaction.notes}</p>}
          </div>

          <div>
            <label htmlFor="payment_channel" className="block text-sm font-medium">Payment Channel</label>
            <input
              type="text"
              name="payment_channel"
              value={transactionData.payment_channel}
              onChange={handleTransactionInputChange}
              placeholder="Payment Channel"
              className="w-full px-4 py-2 border rounded-md"
            />
            {errorsTransaction.payment_channel && <p className="text-red-500 text-sm">{errorsTransaction.payment_channel}</p>}
          </div>

          <div className="col-span-2">
            <label htmlFor="proof_payment" className="block text-sm font-medium">Proof of Payment</label>
            <input
              type="file"
              name="proof_payment"
              onChange={handleTransactionFileChange}
              accept="image/*"
              className="w-full px-4 py-2 border rounded-md"
            />
            {errorsTransaction.proof_payment && <p className="text-red-500 text-sm">{errorsTransaction.proof_payment}</p>}
          </div>
        </div>
      </ModalComponent>

      {/* Out Modal */}
      <ModalComponent
        isOpen={isWithdrawModalOpen}
        onOpenChange={setIsWithdrawModalOpen}
        modalTitle="Withdraw"
        onSave={handleSaveWithdrawal}
      >
        <div className="grid grid-cols-2 gap-4 w-full">
          <div>
            <label htmlFor="account_id" className="block text-sm font-medium">Account</label>
            <select
              name="account_id"
              value={withdrawData.account_id}
              onChange={(e) => setWithdrawData({ ...withdrawData, account_id: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="">Select Account</option>
              {accountData.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            {errorsWithdraw.account_id && <p className="text-red-500 text-sm">{errorsWithdraw.account_id}</p>}
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={withdrawData.date}
              onChange={handleWithdrawalInputChange}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errorsWithdraw.date && <p className="text-red-500 text-sm">{errorsWithdraw.date}</p>}
          </div>

          <div>
            <label htmlFor="particulars" className="block text-sm font-medium">Particulars</label>
            <input
              type="text"
              name="particulars"
              value={withdrawData.particulars}
              onChange={handleWithdrawalInputChange}
              placeholder="Particulars"
              className="w-full px-4 py-2 border rounded-md"
            />
            {errorsWithdraw.particulars && <p className="text-red-500 text-sm">{errorsWithdraw.particulars}</p>}
          </div>

          <div>
            <label htmlFor="withdraw_amount" className="block text-sm font-medium">Withdrawal Amount</label>
            <input
              type="number"
              name="withdraw_amount"
              value={withdrawData.withdraw_amount}
              onChange={handleWithdrawalInputChange}
              placeholder="Withdrwa Amount"
              className="w-full px-4 py-2 border rounded-md"
            />
            {errorsWithdraw.withdraw_amount && <p className="text-red-500 text-sm">{errorsWithdraw.withdraw_amount}</p>}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium">Notes</label>
            <input
              type="text"
              name="notes"
              value={withdrawData.notes}
              onChange={handleWithdrawalInputChange}
              placeholder="Notes"
              className="w-full px-4 py-2 border rounded-md"
            />
            {errorsWithdraw.notes && <p className="text-red-500 text-sm">{errorsWithdraw.notes}</p>}
          </div>
        </div>
      </ModalComponent>

      {/* Consign */}
      {activeTab === "loan" && (
        <div className=" bg-white shadow-md rounded-lg p-6 dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Financial Table for Loans</h1>
          </div>

          <div className="mb-4 flex justify-between items-center space-x-4">
            <div className="flex">
              <input
                type="text"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                placeholder="Search borrower"
                className="px-4 py-2 border rounded-md "
              />
              <div className="ml-2">
                <RowsPerPage
                  rowsPerPage={rowsPerPage}
                  setRowsPerPage={setRowsPerPage}
                />
              </div>
            </div>
            <div className="items-end">
              <Export
                label="Export"
              />
            </div>
          </div>

          <div className="overflow-auto">
            <table className="min-w-full bg-white border-collapse shadow-lg rounded-lg dark:bg-gray-700">
              <thead className="bg-gray-200 dark:bg-gray-300">
                <tr>
                  {["Date", "Borrower", "Initial Amount", "Interest Rate (%)", "Total Payment"].map(
                    (column, idx) => (
                      <th
                        key={idx}
                        className="py-3 px-4 text-left text-sm font-medium text-gray-700"
                        onClick={() =>
                          setSortDescriptor({
                            column: column.toLowerCase().replace(" ", "_"),
                            direction:
                              sortDescriptor.column === column.toLowerCase().replace(" ", "_") &&
                                sortDescriptor.direction === "ascending"
                                ? "descending"
                                : "ascending",
                          })
                        }
                      >
                        {column}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((item) => (
                    <tr key={item.borrower + item.date}>
                      <td className="py-3 px-4">{renderCell(item, "date")}</td>
                      <td className="py-3 px-4">{renderCell(item, "borrower")}</td>
                      <td className="py-3 px-4">{renderCell(item, "initial_amount")}</td>
                      <td className="py-3 px-4">{renderCell(item, "interest_percentage")}</td>
                      <td className="py-3 px-4">{renderCell(item, "total_payment")}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-3 px-4 text-center">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
              Previous
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-100">
              Page {page} of {Math.ceil(data.length / rowsPerPage)}
            </span>
            <Button
              onClick={() => setPage((prev) => Math.min(prev + 1, Math.ceil(data.length / rowsPerPage)))}
              disabled={page === Math.ceil(data.length / rowsPerPage)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* PMS */}
      {activeTab === "preventive-maintenance" && (
        <div className=" bg-white shadow-md rounded-lg p-6 dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Financial Table for Preventive Maintenance</h1>
          </div>

          <div className="mb-4 flex justify-between items-center space-x-4">
            <div className="flex">
              <input
                type="text"
                value={filterValueAcc}
                onChange={(e) => setFilterValueAcc(e.target.value)}
                placeholder="Search account"
                className="px-4 py-2 border rounded-md "
              />
              <div className="ml-2">
                <RowsPerPage
                  rowsPerPage={rowsPerPage}
                  setRowsPerPage={setRowsPerPage}
                />
              </div>
            </div>
            <div className="items-end">
              <Export
                label="Export"
              />
            </div>
          </div>

          <div className="overflow-auto">
            <table className="min-w-full bg-white border-collapse shadow-lg rounded-lg dark:bg-gray-700">
              <thead className="bg-gray-200 dark:bg-gray-300">
                <tr>
                  {["Date", "Parts Replaced", "Quantity", "Price per Pices", "Total Amount"].map(
                    (column, idx) => (
                      <th
                        key={idx}
                        className="py-3 px-4 text-left text-sm font-medium text-gray-700"
                        onClick={() =>
                          setSortDescriptorPMS({
                            column: column.toLowerCase().replace(" ", "_"),
                            direction:
                              sortDescriptorPMS.column === column.toLowerCase().replace(" ", "_") &&
                                sortDescriptorPMS.direction === "ascending"
                                ? "descending"
                                : "ascending",
                          })
                        }
                      >
                        {column}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedDataPMS.length > 0 ? (
                  paginatedDataPMS.map((item) => (
                    <tr key={item.plate_number + item.date}>
                      <td className="py-3 px-4">{formatDate(item.date)}</td>
                      <td className="py-3 px-4">{item.parts_replaced}</td>
                      <td className="py-3 px-4">{item.quantity}</td>
                      <td className="py-3 px-4">{(item.price_parts_replaced || 0).toLocaleString("en-PH", { style: "currency", currency: "PHP", minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-4">
                        {(item.quantity * (item.price_parts_replaced || 0)).toLocaleString("en-PH", { style: "currency", currency: "PHP", minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="py-3 px-4 text-center">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>


          {/* Pagination */}
          <div className="mt-4 flex justify-between items-center">
            <Button onPress={() => setPage(page > 1 ? page - 1 : 1)} disabled={page === 1}>
              Previous
            </Button>
            <span className="text-sm text-gray-700 dark:text-gray-100">
              Page {page} of {Math.ceil(sortedDataPMS.length / rowsPerPage)}
            </span>
            <Button
              onPress={() => setPage(page < Math.ceil(sortedDataPMS.length / rowsPerPage) ? page + 1 : page)}
              disabled={page === Math.ceil(sortedDataPMS.length / rowsPerPage)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* ACCOUNTs */}
      {activeTab === "accounts" && (
        <div className="bg-white shadow-md rounded-lg p-6 lg:flex dark:bg-gray-800">
          <div className="lg:w-1/6 pr-6">
            <div className="border rounded-md p-1">
              <p className="font-bold mb-2">Select Account</p>
              <ul>
                <li
                  onClick={() => setFilterValueAcc('')}
                  className={`px-4 py-2 border cursor-pointer hover:bg-gray-100  dark:hover:text-black ${filterValueAcc === '' ? 'bg-gray-200 font-semibold dark:text-black' : ''}`}
                >
                  Show All Accounts
                </li>

                {dataAcc && dataAcc.length > 0 ? (
                  dataAcc
                    .filter((value, index, self) =>
                      self.findIndex(item => item.account_name === value.account_name) === index
                    )
                    .map(item => (
                      <li
                        key={item.account_id}
                        onClick={() => setFilterValueAcc(item.account_id)}
                        className={`px-4 py-2 border cursor-pointer hover:bg-gray-100 dark:hover:text-black ${filterValueAcc === item.account_id ? 'bg-gray-200 font-semibold dark:text-black' : ''}`}
                      >
                        {item.account_name}
                      </li>
                    ))
                ) : (
                  <li className="px-4 py-2 border text-gray-500">No accounts available</li>
                )}
              </ul>
            </div>
          </div>

          <div className="mt-5 lg:w-10/12">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-semibold text-gray-800">Financial Table for Job Offers</h1>
            </div>
            <div className="mb-4 flex justify-between items-center space-x-4">
              <div className="flex">
                <input
                  type="text"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  placeholder="Search account"
                  className="px-4 py-2 border rounded-md "
                />
                <div className="ml-2">
                  <RowsPerPage
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                  />
                </div>
              </div>
              <div className="items-end">
                <Export
                  label="Export"
                />
              </div>
            </div>

            <div className="overflow-auto">
              <table className="lg:min-w-full bg-white border-collapse shadow-lg rounded-lg dark:bg-gray-700">
                <thead className="bg-gray-200 dark:bg-gray-300">
                  <tr>
                    {["Date", "Account Name", "Particulars", "Service Fee", "Expense", "Net Income"].map(
                      (column, idx) => (
                        <th
                          key={idx}
                          className="py-3 px-4 text-left text-sm font-medium text-gray-700"
                          onClick={() =>
                            setSortDescriptorAcc({
                              column: column.toLowerCase().replace(" ", "_"),
                              direction:
                                sortDescriptorAcc.column === column.toLowerCase().replace(" ", "_") &&
                                  sortDescriptorAcc.direction === "ascending"
                                  ? "descending"
                                  : "ascending",
                            })
                          }
                        >
                          {column}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {paginatedDataAcc.length > 0 ? (
                    paginatedDataAcc.map((item) => (
                      <tr key={item.account_id + item.date}>
                        <td className="py-3 px-4">{formatDate(item.date)}</td>
                        <td className="py-3 px-4">{item.account_name}</td>
                        <td className="py-3 px-4">{item.particulars}</td>
                        <td className="py-3 px-4">
                          {(item.deposit_amount || 0).toLocaleString("en-PH", { style: "currency", currency: "PHP", minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4">
                          {(item.withdraw_amount || 0).toLocaleString("en-PH", { style: "currency", currency: "PHP", minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4">
                          {item.net_income.toLocaleString("en-PH", { style: "currency", currency: "PHP", minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-3 px-4 text-center">
                        No data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>


            {/* Pagination */}
            <div className="mt-4 flex justify-between items-center">
              <Button onPress={() => setPage(page > 1 ? page - 1 : 1)} disabled={page === 1}>
                Previous
              </Button>
              <span className="text-sm text-gray-700 dark:text-gray-100">
                Page {page} of {Math.ceil(sortedDataAcc.length / rowsPerPage)}
              </span>
              <Button
                onPress={() => setPage(page < Math.ceil(sortedDataAcc.length / rowsPerPage) ? page + 1 : page)}
                disabled={page === Math.ceil(sortedDataAcc.length / rowsPerPage)}
              >
                Next
              </Button>
            </div>

            {/* Total Net Income Per Day */}
            <div className="mt-4 p-4  text-right">
              <h5
                className="font-bold text-xl text-gray-800">Total Net Income:{" "} 
                {totalNetIncome.toLocaleString("en-PH", {
                  style: "currency",
                  currency: "PHP",
                  minimumFractionDigits: 2,
                })}
              </h5>
            </div>
          </div>
        </div>
      )
      }
      <ToastContainer />
    </div >
  );
}
