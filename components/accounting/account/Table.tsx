"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@heroui/button";
import ModalComponent from "../Modal";
import { toast, ToastContainer } from "react-toastify";
import Export from "../export";
import { IoCloseCircle } from "react-icons/io5";
import { RiDeleteBin6Fill } from "react-icons/ri";
import RowsPerPage from "@/components/RowsPerPage";



interface Account {
  id: number;
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
}

interface AccountData {
  id: string;
  name: string;
}

interface Balance {
  starting_balance: number;
  outstanding_balance: number;
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

interface StartingBalanceFormData {
  account_id: string;
  starting_balance: number;
}

export default function App() {
  const [data, setData] = useState<Account[]>([]);
  const [accountData, setAccountData] = useState<AccountData[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<number | string>('');
  const [accountBalances, setAccountBalances] = useState<{ [key: string]: Balance }>({});
  const [accountIds, setAccountIds] = useState<string[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isStartingModalOpen, setIsStartingModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const openImageModal = () => setIsImageModalOpen(true);
  const closeImageModal = () => setIsImageModalOpen(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    name: "",
    account_id: "",
    date: "",
    particulars: "",
    deposit_amount: 0,
    notes: "",
    payment_channel: "",
    proof_payment: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.account_id) newErrors.account_id = "Account is required.";
    if (!formData.date) newErrors.date = "Date is required.";
    if (!formData.deposit_amount || isNaN(Number(formData.deposit_amount)) || Number(formData.deposit_amount) <= 0) {
      newErrors.deposit_amount = "Valid deposit amount is required.";
    }
    if (!formData.particulars) newErrors.particulars = "Particulars details are required.";
    if (!formData.notes) newErrors.notes = "Notes is required.";
    if (!formData.payment_channel) newErrors.payment_channel = "Payment channel is required.";
    if (!formData.proof_payment) newErrors.proof_payment = "Proof is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
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

  const [startingData, setStartingData] = useState<StartingBalanceFormData>({
    account_id: "",
    starting_balance: 0,
  });
  const [errorsStarting, setErrorsStarting] = useState<Record<string, string>>({});

  const validateFormStarting = () => {
    const newErrors: Record<string, string> = {};

    if (!startingData.account_id) newErrors.account_id = "Account is required.";
    if (!startingData.starting_balance || isNaN(Number(startingData.starting_balance)) || Number(startingData.starting_balance) <= 0) {
      newErrors.starting_balance = "Valid starting balance is required.";
    }

    setErrorsStarting(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = dateObj.toLocaleString("en-GB", { month: "short" });
    const year = dateObj.getFullYear().toString().slice(-2);
    return `${day} - ${month} - ${year}`;
  };


  const [sortDescriptor, setSortDescriptor] = useState({ column: "date", direction: "ascending" });
  const [page, setPage] = useState(1);


  const fetchAccountData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/accounts`);
      const result = await response.json();
      // console.log(result);
      setAccountData(result.accounts || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // console.log(accountData);
    fetchAccountData();
    const intervalId = setInterval(fetchAccountData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const deleteTransaction = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/transactions/${id}`,
        {
          method: 'DELETE',
        }
      );
      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
      } else {
        toast.error('Failed to delete transaction.');
      }
    } catch (error) {
      toast.error('Error occurred while deleting transaction.');
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/transactions`);
      const result = await response.json();
      const data = result.data || [];
      setData(data);
      console.log(data);

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
      setAccountBalances(balanceMap);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleStartingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStartingData((prev) => ({ ...prev, [name]: value }));
  };


  // ACCOUNT SAVE
  const handleSaveAccount = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: formData.name }),
    });

    const result = await response.json();
    if (result.success) {
      setIsModalOpen(false);
      toast.success(result.message || 'Account added successfully');
      fetchAccountData();
    } else {
      const errorMessages = result.errors
        ? Object.values(result.errors).join(', ')
        : 'Error adding account';
      toast.error(errorMessages);
    }
  };

  // IN MODAL SAVE
  const handleSaveTransaction = async () => {
    if (!validateForm()) {
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
        fetchData();
      } else {
        const errorMessages = result.errors ? Object.values(result.errors).join(', ') : 'Error adding withdrawal';
        toast.error(errorMessages);
      }
    } catch (error) {
      console.error('Error saving withdrawal:', error);
      toast.error('There was an error saving the withdrawal. Please try again later.');
    }
  };


  // STARTING BALANCE SAVE
  const handleSaveStarting = async () => {
    if (!validateFormStarting()) {
      // console.log("Validation failed!", formData);
      toast.error("Please input complete details!");
      return;
    }

    const requestData = {
      account_id: startingData.account_id,
      starting_balance: String(startingData.starting_balance),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/startingbalance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 200) {
        setIsStartingModalOpen(false);
        setStartingData({
          account_id: "",
          starting_balance: 0,
        });
        toast.success(result.message || 'Starting Balance added successfully');
        fetchData();
      } else {
        const errorMessages = result.errors ? Object.values(result.errors).join(', ') : 'Error adding starting balance';
        toast.error(errorMessages);
      }
    } catch (error) {
      console.error('Error saving starting balance:', error);
      toast.error('There was an error saving the starting balance. Please try again later.');
    }
  };


  const filteredData = useMemo(() => {
    if (!filterValue) return data;

    console.log('Filter Value:', data);

    return data.filter((item) => {
      const accountIdStr = item.account_id.toString().toLowerCase().trim();
      const filterValueStr = filterValue.toLowerCase().trim();
      console.log('Comparing:', accountIdStr, 'with', filterValueStr);
      return accountIdStr === filterValueStr
    });
  }, [data, filterValue]);



  const sortedData = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      const valA = a[sortDescriptor.column as keyof Account];
      const valB = b[sortDescriptor.column as keyof Account];
      if (valA < valB) return sortDescriptor.direction === "ascending" ? -1 : 1;
      if (valA > valB) return sortDescriptor.direction === "ascending" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortDescriptor]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  const renderCell = (item: Account, columnKey: keyof Account) => {
    const value = item[columnKey as keyof Account];
    if (["deposit_amount", "withdraw_amount"].includes(columnKey)) {
      return (typeof value === "number" ? value : 0).toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
      });
    }
    return value;
  };

  const showImageModal = (path: string) => {
    alert(`Show image: ${path}`);
  };


  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex justify-end p-4">
        <Button onPress={() => setIsModalOpen(true)} color="primary" className="mx-1">
          Add Account
        </Button>
        <Button onPress={() => setIsTransactionModalOpen(true)} color="primary" className="mx-1">
          IN
        </Button>
        <Button onPress={() => setIsWithdrawModalOpen(true)} color="primary" className="mx-1">
          OUT
        </Button>
        <Button onPress={() => setIsStartingModalOpen(true)} color="primary" className="mx-1">
          Add Starting Balance
        </Button>
      </div>

      <div className="mb-4 flex flex-col lg:w-1/4">
        <select
          value={filterValue}
          onChange={(e) => {
            setFilterValue(e.target.value);
            setSelectedAccountId(e.target.value);
          }}
          className="px-4 py-2 border rounded-md"
        >
          <option value="">Select Account</option>
          {data && data.length > 0 ? (
            data
              .filter((value, index, self) =>
                self.findIndex(item => item.account_name === value.account_name) === index
              )
              .map((item) => (
                <option key={item.account_id} value={item.account_id}>
                  {item.account_name}
                </option>
              ))
          ) : (
            <option disabled>No accounts available</option>
          )}
        </select>

      </div>

      {/* Starting and remaining Balance */}
      <div className="lg:w-1/4">
        <div className="alert alert-info p-2 mb-2 mt-2" style={{ backgroundColor: "#b6effb", color: "black" }}>
          <strong>Starting Balance:</strong> &nbsp;
          {accountBalances[selectedAccountId]?.starting_balance
            ? `₱ ${new Intl.NumberFormat().format(accountBalances[selectedAccountId]?.starting_balance)}`
            : '-'}
        </div>
        <div className="alert alert-info p-2" style={{ backgroundColor: "rgb(93,164,84)", color: "black" }}>
          <strong>Remaining Balance:</strong> &nbsp;
          {accountBalances[selectedAccountId]?.outstanding_balance
            ? `₱ ${new Intl.NumberFormat().format(accountBalances[selectedAccountId]?.outstanding_balance)}`
            : '-'}
        </div>
      </div>


      {/* Search */}
      <div className="flex mb-4 mt-3 justify-between items-center">
        <div className="flex">
          <input
            type="text"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder="Search"
            className="px-4 py-2 border rounded-md "
          />
          <div className="ml-3">
            <RowsPerPage
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
            />
          </div>
        </div>
        <div className="mt-4">
          <Export label="Export" />
        </div>
      </div>


      {/* Add Account */}
      <ModalComponent isOpen={isModalOpen} onOpenChange={setIsModalOpen} modalTitle="Add New Account" onSave={handleSaveAccount}>
        <label htmlFor="notes" className="block text-sm font-medium">Account Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Account Name"
          className="w-full px-4 py-2 border rounded-md"
        />
      </ModalComponent>

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
            {errors.account_id && <p className="text-red-500 text-sm">{errors.account_id}</p>}
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
            {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
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
            {errors.particulars && <p className="text-red-500 text-sm">{errors.particulars}</p>}
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
            {errors.deposit_amount && <p className="text-red-500 text-sm">{errors.deposit_amount}</p>}
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
            {errors.notes && <p className="text-red-500 text-sm">{errors.notes}</p>}
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
            {errors.payment_channel && <p className="text-red-500 text-sm">{errors.payment_channel}</p>}
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
            {errors.proof_payment && <p className="text-red-500 text-sm">{errors.proof_payment}</p>}
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

      {/* Add Starting Balance */}
      <ModalComponent isOpen={isStartingModalOpen} onOpenChange={setIsStartingModalOpen} modalTitle="Add Starting Balance" onSave={handleSaveStarting}>
        <div>
          <label htmlFor="account_id" className="block text-sm font-medium">Account</label>
          <select
            name="account_id"
            value={startingData.account_id}
            onChange={(e) => setStartingData({ ...startingData, account_id: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="">Select Account</option>
            {accountData.map(item => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          {errorsStarting.account_id && <p className="text-red-500 text-sm">{errorsStarting.account_id}</p>}
        </div>
        <div>
          <label htmlFor="starting_balance" className="block text-sm font-medium">Starting Balance</label>
          <input
            type="number"
            name="starting_balance"
            value={startingData.starting_balance}
            onChange={handleStartingInputChange}
            placeholder="Starting Balance"
            className="w-full px-4 py-2 border rounded-md"
          />
          {errorsStarting.starting_balance && <p className="text-red-500 text-sm">{errorsStarting.starting_balance}</p>}
        </div>
      </ModalComponent>

      <div className="overflow-auto">
        <table className="min-w-full bg-white border-collapse shadow-lg rounded-lg dark:bg-gray-700">
          <thead className="bg-gray-200 dark:bg-gray-300">
            <tr>
              {["Date", "Particulars", "Payment Amount", "Expense Amount", "Payment Channel", "Proof of Payment", "Notes", "Action"].map(
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
                <tr key={item.account_id + item.date}>
                  <td className="py-3 px-4">{formatDate(item.date)}</td>
                  <td className="py-3 px-4">{item.particulars}</td>
                  <td className="py-3 px-4">
                    {item.deposit_amount !== undefined && item.deposit_amount !== null
                      ? `₱ ${item.deposit_amount.toLocaleString()}`
                      : '₱ 0.00'}
                  </td>
                  <td className="py-3 px-4">
                    {item.withdraw_amount !== undefined && item.withdraw_amount !== null
                      ? `₱ ${item.withdraw_amount.toLocaleString()}`
                      : '₱ 0.00'}
                  </td>
                  <td className="py-3 px-4">{item.payment_channel}</td>
                  <td className="py-3 px-4">
                    {item.proof_payment ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${item.proof_payment}`}
                        alt="Payment proof"
                        className="h-10 w-10 rounded-full cursor-pointer"
                        onClick={() => {
                          setSelectedImage(`${process.env.NEXT_PUBLIC_SERVER_PORT}/${item.proof_payment}`);
                          openImageModal();
                        }}
                      />
                    ) : (
                      <span>No proof</span>
                    )}
                  </td>
                  <td className="py-3 px-4">{item.notes}</td>
                  <td className="py-3 px-4">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => deleteTransaction(item.id)}
                    >
                      <RiDeleteBin6Fill size={24} />
                    </button>
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
          {isImageModalOpen && selectedImage && (
            <div
              className="fixed inset-0 flex justify-center items-center z-50"
              onClick={closeImageModal}
            >
              <div
                className="bg-white p-8 rounded shadow-lg relative"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage}
                  alt="Payment proof"
                  className="max-h-96 max-w-full object-contain"
                />
                <button
                  className="absolute top-0 right-0 p-2 text-gray-600"
                  onClick={closeImageModal}
                >
                  <IoCloseCircle size={24} />
                </button>
              </div>
            </div>
          )}
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <Button onPress={() => setPage(page > 1 ? page - 1 : 1)} disabled={page === 1}>
          Previous
        </Button>
        <span className="text-sm text-gray-700">
          Page {page} of {Math.ceil(sortedData.length / rowsPerPage)}
        </span>
        <Button
          onPress={() => setPage(page < Math.ceil(sortedData.length / rowsPerPage) ? page + 1 : page)}
          disabled={page === Math.ceil(sortedData.length / rowsPerPage)}
        >
          Next
        </Button>
      </div>

      <ToastContainer />
    </div>
  );
}
