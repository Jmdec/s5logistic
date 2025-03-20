"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import html2canvas from "html2canvas";

interface Product {
    name: any;
    unit: any;
    quantity: number;
}


interface Backloads {
    name: string;
    contact_number: any;
    location: string;
}

interface FormData {
    driver_name: number;
    plate_number: string;
    total_payment: string;
    driver_license_no: string;
    sender_name: string;
    transport_mode: string;
    delivery_type: string;
    journey_type: string;
    date_from: string;
    date_to: string;
    origin: string;
    destination: string;
    eta: string;
    consignee_name: string;
    consignee_address: string;
    consignee_email: string;
    consignee_mobile: string;
    merchant_name: string;
    merchant_address: string;
    merchant_email: string;
    merchant_mobile: string;
    truck_type: string;
    backloads: Backloads[];
    products: Product[];
}


export default function BookingForm() {
    const [inputValue, setInputValue] = useState("");
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [subcontractors, setSubcontractors] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [products, setProducts] = useState<Product[]>([
        { name: "", unit: "", quantity: 0 } // Initial empty product
    ]);

    const [backloads, setBackloads] = useState<Backloads[]>([]);
    const [showBackLoad, setShowBackLoad] = useState<boolean>(false);
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [showCompanyVehicles, setShowCompanyVehicles] = useState(false);
    const [showSubcontractors, setShowSubcontractors] = useState(false);
    const [showSubcontractorData, setShowSubcontractorData] = useState(false);
    const [selectedSubcontractor, setSelectedSubcontractor] = useState(null);
    const [bookingData, setBookingData] = useState<FormData[]>([]);
    const [senderNames, setSenderNames] = useState<string[]>([]);
    const [filteredNames, setFilteredNames] = useState<string[]>(senderNames);
    const [selectedDriver, setSelectedDriver] = useState<string>("");
    const [licenseNumber, setLicenseNumber] = useState<string>("");
    const [driver_id, setDriverId] = useState("");
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [trackingNumber, setTrackingNumber] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        driver_name: 0,
        plate_number: '',
        total_payment: '',
        driver_license_no: '',
        sender_name: '',
        transport_mode: '',
        delivery_type: '',
        journey_type: '',
        date_from: '',
        date_to: '',
        origin: '',
        destination: '',
        eta: '',
        consignee_name: '',
        consignee_address: '',
        consignee_email: '',
        consignee_mobile: '',
        merchant_name: '',
        merchant_address: '',
        merchant_email: '',
        merchant_mobile: '',
        truck_type: '',
        backloads: [{ name: '', contact_number: '', location: "" }],
        products: [{ name: '', unit: '', quantity: 0 }]
    });

    const handleAddProduct = () => {
        setProducts([...products, { name: "", unit: "", quantity: 0 }]);
    };

    const [isCompanyVehiclesDisabled, setIsCompanyVehiclesDisabled] = useState(false);
    const [isSubcontractorsDisabled, setIsSubcontractorsDisabled] = useState(false);

    const handleProductChange = (index: number, field: keyof Product, value: string | number) => {

        const updatedProducts = [...products];
        updatedProducts[index][field] = value;

        setProducts(updatedProducts);

        setFormData((prev) => ({
            ...prev,
            products: updatedProducts,
        }));
    };

    const handleRemoveProduct = (index: number) => {
        const updatedProducts = products.filter((_, i) => i !== index);

        setProducts(updatedProducts);

        setFormData((prev) => ({
            ...prev,
            products: updatedProducts,
        }));
    };

    const handleAddBackLoads = () => {
        setBackloads([...backloads, { name: "", contact_number: "", location: "" }]);
    };

    const handleBackloadInputChange = (index: number, field: keyof Backloads, value: string | number) => {
        const updatedBackloads = [...backloads];
        updatedBackloads[index][field] = value;

        setBackloads(updatedBackloads);

        setFormData((prev) => ({
            ...prev,
            backloads: updatedBackloads,
        }));
    };

    const handleRemoveBackLoads = (index: number) => {
        const updatedBackloads = backloads.filter((_, i) => i !== index);

        setBackloads(updatedBackloads);

        setFormData((prev) => ({
            ...prev,
            backloads: updatedBackloads,
        }));
    };

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/get-form-data`);
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
                console.log(data)
                setBookingData(data.bookingData);
                setSenderNames(data.senderNames);
                setVehicles(data.vehicles);
                setSubcontractors(data.subcontractors);
                setUsers(data.users);
            } catch (error) {
                console.error(error);
            }
        };

        fetchFormData();
    }, []);



    useEffect(() => {
        if (inputValue) {
            const filtered = senderNames.filter((name) =>
                name.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredNames(filtered);
        } else {
            setFilteredNames([]);
        }
    }, [inputValue, senderNames]);



    useEffect(() => {
        if (inputValue) {
            const filtered = senderNames.filter((name) =>
                name.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredNames(filtered);
        } else {
            setFilteredNames([]);
        }
    }, [inputValue, senderNames]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        setFormData((prevFormData) => ({
            ...prevFormData,
            sender_name: value,
        }));

        // Filter sender names based on the input value
        const filtered = senderNames.filter((name) =>
            name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredNames(filtered);
    };

    const handleSelect = (selectedName: string) => {
        
        setInputValue(selectedName);
        
        const matchedBookingData = bookingData.find(
            (booking) => booking.sender_name === selectedName
        );
        if (matchedBookingData) {


            const matchedDriver = users.find(
                (user) => user.id === matchedBookingData.driver_name
            );

            if (matchedDriver) {
                setSelectedDriver(matchedDriver.name);
            }

            const backloadsData = matchedBookingData.backloads || [];
            const productsData = matchedBookingData.products || [];

            setBackloads(backloadsData);
            setProducts(productsData);


            if (matchedBookingData.truck_type && !matchedBookingData.truck_type.includes('-')) {
                setShowCompanyVehicles(true);  // Show company vehicles
                setShowSubcontractors(false);  // Hide subcontractors
            } else {
                setShowCompanyVehicles(false);  // Hide company vehicles
                setShowSubcontractors(true);    // Show subcontractors
            }

            setIsCompanyVehiclesDisabled(showSubcontractors);  // Disable company vehicles checkbox if subcontractors are shown
            setIsSubcontractorsDisabled(showCompanyVehicles);
            setFormData((prevFormData) => ({
                ...prevFormData,
                sender_name: selectedName,
                driver_name: matchedBookingData.driver_name,
                plate_number: matchedBookingData.plate_number,
                total_payment: matchedBookingData.total_payment,
                driver_license_no: matchedBookingData.driver_license_no,
                transport_mode: matchedBookingData.transport_mode,
                delivery_type: matchedBookingData.delivery_type,
                journey_type: matchedBookingData.journey_type,
                date_from: matchedBookingData.date_from,
                date_to: matchedBookingData.date_to,
                origin: matchedBookingData.origin,
                destination: matchedBookingData.destination,
                eta: matchedBookingData.eta,
                consignee_name: matchedBookingData.consignee_name,
                consignee_address: matchedBookingData.consignee_address,
                consignee_email: matchedBookingData.consignee_email,
                consignee_mobile: matchedBookingData.consignee_mobile,
                merchant_name: matchedBookingData.merchant_name,
                merchant_address: matchedBookingData.merchant_address,
                merchant_email: matchedBookingData.merchant_email,
                merchant_mobile: matchedBookingData.merchant_mobile,
                truck_type: matchedBookingData.truck_type,
                backloads: backloadsData,
                products: productsData,
            }));

            setSelectedOption(matchedBookingData.delivery_type);
            setLicenseNumber(matchedBookingData.driver_license_no);
        }
        setFilteredNames([]);
    };
    const handleDriverChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const driverName = e.target.value;
        const driver = users.find((user) => user.name === driverName);

        setSelectedDriver(driverName);
        setLicenseNumber(driver?.license_number || "");
        setDriverId(driver?.id || "");

        setFormData((prev) => ({
            ...prev,
            driver_license_no: driver?.license_number || "",
            driver_name: driver?.id,
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const deliveryType = e.target.value;
        setSelectedOption(deliveryType);
        setShowBackLoad(deliveryType === "Backload");
        setFormData((prev) => ({ ...prev, delivery_type: deliveryType }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        const requestBody = {
            ...formData,
            products,
            backloads,
            user_id: sessionStorage.getItem('user_id'),
        };

        console.log(requestBody);

        try {
            let accessToken = sessionStorage.getItem('token');

            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/submit`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const result = await response.json();
                toast.success("Form submitted successfully!");
                console.log(result);

                setQrCodeUrl(result.qrCodeUrl);
                setTrackingNumber(result.trackingNumber)
                setIsModalOpen(true);
            } else {
                const errorData = await response.json();

                if (errorData.errors) {
                    Object.keys(errorData.errors).forEach(field => {
                        (errorData.errors[field] as string[]).forEach((errorMessage: string) => {
                            toast.error(`${field}: ${errorMessage}`);
                        });
                    });
                } else {
                    toast.error(errorData.message || "Failed to submit form");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Error submitting form");
        }
        setLoading(false);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        fieldName: string
    ) => {
        const { value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [fieldName]: value,
        }));
    };
    const checkFormCompletion = () => {
        const requiredFields = [
            formData.driver_name,
            formData.driver_license_no,
            formData.plate_number,
            formData.sender_name,
            formData.transport_mode,
            formData.delivery_type,
            formData.journey_type,
            formData.date_from,
            formData.date_to,
            formData.origin,
            formData.destination,
            formData.eta,
            formData.consignee_name,
            formData.consignee_email,
            formData.consignee_mobile,
            formData.consignee_address,
            formData.merchant_name,
            formData.merchant_mobile,
            formData.merchant_email,
            formData.merchant_address,
            formData.truck_type,
            formData.total_payment,
        ];

        const allFilled = requiredFields.every((value) => {
            return value && String(value).trim() !== '';
        });

        setIsFormValid(allFilled);
    };


    useEffect(() => {
        console.log(formData);
        checkFormCompletion();
    }, [formData]);
    const handleDownload = () => {
        const formElement = document.getElementById("booking-form");
        const dlBtn = document.getElementById("download-btn");
        const sbmitBtn = document.getElementById("submit-btn");
        const addBtn = document.getElementById("add-btn");

        if (dlBtn) dlBtn.style.display = "none";
        if (sbmitBtn) sbmitBtn.style.display = "none";
        if (addBtn) addBtn.style.display = "none";

        if (formElement) {
            const originalStyles = formElement.getAttribute("style") || "";
            formElement.style.overflow = "visible";

            html2canvas(formElement, {
                backgroundColor: "#ffffff", 
                scale: 2, 
                useCORS: true,
            }).then((canvas) => {
                formElement.style.cssText = originalStyles;

                const link = document.createElement("a");
                link.download = "booking-form.png";
                link.href = canvas.toDataURL("image/png");
                link.click();

                if (dlBtn) dlBtn.style.display = "block";
                if (sbmitBtn) sbmitBtn.style.display = "block";
            });
        } else {
            console.error("Form element not found");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg" id="booking-form">
            <div className="text-center mb-6">
                <Image
                    src="/logo-without-bg.png"
                    alt="Admin Panel Logo"
                    width={100}
                    height={100}
                    className="mx-auto w-24 mb-4"
                />
                <h1 className="text-2xl font-bold text-red-900 dark:text-gray-800">Booking Form</h1>
                <p className="text-sm dark:text-gray-800">Fill out the form below to arrange for the transportation of your goods.</p>
            </div>

            {/* Truck Details */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold border-b pb-2 mb-4 dark:text-gray-800">Truck Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block dark:text-gray-800">Driver Name</label>
                        <select className="w-full p-2 border rounded-lg text-red-900 border-red-900 focus:ring-red-600 dark:bg-white"
                            value={selectedDriver}
                            onChange={handleDriverChange}
                            required
                        >
                            <option>Select Driver</option>
                            {users.length > 0 ? (
                                users.map((user, index) => (
                                    <option key={index} value={user.name}>{user.name}</option>
                                ))
                            ) : (
                                <li>No couriers available</li>
                            )}
                        </select>
                    </div>
                    <div>
                        <label className="block dark:text-gray-800 ">Driver License No.</label>
                        <input type="text" className="w-full p-2 border rounded-lg 
        border-red-900 text-red-900 placeholder:text-gray-400 dark:bg-white"
                            placeholder="Ex: 100100"
                            value={licenseNumber}
                            readOnly required />
                        <input type="hidden" className="w-full p-2 border rounded-lg 
        border-red-900 text-red-900 placeholder:text-gray-400 dark:bg-white"
                            placeholder="Driver ID (Driver Name)"
                            value={driver_id}
                            readOnly />
                    </div>
                    <div>
                        <label className="block  dark:text-gray-800">Plate No.</label>
                        <input type="text" className="w-full p-2 border rounded-lg
                         border-red-900 text-red-900 placeholder:text-gray-400 dark:bg-white"
                            placeholder="Ex: 1001010"
                            value={formData.plate_number || ""}
                            onChange={(e) => setFormData({ ...formData, plate_number: e.target.value })}
                            required />
                    </div>
                </div>
            </div>

            {/* Delivery Information */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold border-b pb-2 mb-4 dark:text-gray-800">Delivery Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <label className="block dark:text-gray-800">Account Name</label>
                        <input
                            type="text"
                            value={formData.sender_name || ""}
                            onChange={handleNameChange}
                            className="w-full p-2 border rounded-lg border-red-900 text-red-900 placeholder:text-gray-400 dark:bg-white"
                            placeholder="Ex: Jose Marie"
                            required
                        />

                        {inputValue && filteredNames.length > 0 && (
                            <ul className="absolute left-0 right-0 bg-white shadow-lg border rounded-lg z-10 mt-1">
                                {filteredNames.map((name, index) => (
                                    <li
                                        key={index}
                                        className="p-2 cursor-pointer hover:bg-gray-200"
                                        onClick={() => handleSelect(name)}
                                    >
                                        {name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div>
                        <label className="block dark:text-gray-800">Transport Mode</label>
                        <select className="w-full p-2 border rounded-lg text-red-900 border-red-900 focus:ring-red-600 dark:bg-white"
                            value={formData.transport_mode || ""}
                            onChange={(e) => handleInputChange(e, "transport_mode")} required
                        >
                            <option>Select transmort mode</option>
                            <option className="" value={"Land Transport"}>Land Transport</option>
                            <option className="" value={"Water Transport"}>Water Transport</option>
                        </select>
                    </div>
                    <div>
                        <label className="block dark:text-gray-800">Delivery Type</label>
                        <select className="w-full p-2 border rounded-lg text-red-900 border-red-900 focus:ring-red-600 dark:bg-white"
                            value={selectedOption}
                            onChange={handleSelectChange} required
                        >
                            <option>Select delivery type</option>
                            <option>Direct Delivery</option>
                            <option>Warehouse Transfer</option>
                            <option>Backload</option>
                        </select>
                    </div>
                </div>
                {showBackLoad && (
                    <div className="pb-10 mt-4">
                        {/* Button to add more backload fields */}
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={handleAddBackLoads}
                                id="add-btn"
                                className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
                            >
                                + Add Backloads
                            </button>
                        </div>
                        {backloads.map((item, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                    <label className="block dark:text-gray-800">Receiver Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded-lg border-red-900 text-red-900 placeholder:text-gray-400 dark:bg-white"
                                        placeholder="Enter Receiver Name"
                                        value={item.name}
                                        onChange={(e) => handleBackloadInputChange(index, 'name', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block dark:text-gray-800">Contact Number</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded-lg border-red-900 text-red-900 placeholder:text-gray-400 dark:bg-white"
                                        placeholder="Enter Contact Number"
                                        value={item.contact_number}
                                        maxLength={11}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                            if (value.length <= 11) {
                                                handleBackloadInputChange(index, 'contact_number', e.target.value);
                                            }
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block dark:text-gray-800">Location</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded-lg border-red-900 text-red-900 placeholder:text-gray-400 dark:bg-white"
                                        placeholder="Enter Location"
                                        value={item.location}
                                        onChange={(e) => handleBackloadInputChange(index, 'location', e.target.value)}
                                    />
                                </div>
                                <button
                                    className=""
                                    onClick={() => handleRemoveBackLoads(index)}
                                >
                                    <XMarkIcon className="flex w-8 ml-5 justify-center mt-4 text-red-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                    <div>
                        <label className="block dark:text-gray-800">Journey Type</label>
                        <select className="w-full p-2 border rounded-lg text-red-900 border-red-900 focus:ring-red-600 dark:bg-white"
                            value={formData.journey_type || ""}
                            onChange={(e) => handleInputChange(e, "journey_type")} required
                        >
                            <option >Select Journey Type</option>
                            <option className="" value={"Interisland"}>Interisland</option>
                            <option className="" value={"Local"}>Local</option>
                        </select>
                    </div>
                    <div>
                        <label className="block dark:text-gray-800">Date From</label>
                        <input type="date" className="w-full p-2 border rounded-lg
                         border-red-900 text-red-900 placeholder:text-gray-400 dark:bg-white"
                            value={formData.date_from || ""}
                            onChange={(e) => handleInputChange(e, 'date_from')} required />

                    </div>
                    <div>
                        <label className="block dark:text-gray-800">Date To</label>
                        <input type="date" className="w-full p-2 border rounded-lg
                         border-red-900 text-red-900 placeholder:text-gray-400 dark:bg-white"
                            value={formData.date_to || ""}
                            onChange={(e) => handleInputChange(e, 'date_to')} required />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                        <label className="block dark:text-gray-800">Origin</label>
                        <input type="text" className="w-full p-2 border rounded-lg
                         border-red-900 text-red-900 placeholder:text-gray-400 dark:bg-white"
                            placeholder="Ex: Address"
                            value={formData.origin || ""}
                            onChange={(e) => handleInputChange(e, 'origin')} required />
                    </div>
                    <div>
                        <label className="block dark:text-gray-800">Destination</label>
                        <input type="text" className="w-full p-2 border rounded-lg
                         border-red-900 text-red-900 placeholder:text-gray-400 dark:bg-white"
                            placeholder="Ex: Makati"
                            value={formData.destination || ""}
                            onChange={(e) => handleInputChange(e, 'destination')} required />
                    </div>
                    <div>
                        <label className="block dark:text-gray-800 ">Estimated Time of Arrival (ETA)</label>
                        <input type="text" className="w-full p-2 border rounded-lg
                         border-red-900 text-red-900 placeholder:text-gray-400 dark:bg-white"
                            placeholder="Ex: 9:00 PM"
                            value={formData.eta || ""}
                            onChange={(e) => handleInputChange(e, 'eta')} required />
                    </div>
                </div>
            </div>

            {/* List of Products */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-lg font-semibold dark:text-gray-800">List of Products</h2>
                    <button
                        onClick={handleAddProduct}
                        id="add-btn"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Add Product
                    </button>
                </div>

                {products.map((product, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block dark:text-gray-800 ">Product Name</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-lg border-red-900 text-red-900 placeholder:text-gray-400 dark:bg-white"
                                placeholder="Enter Product Name"
                                value={product.name}
                                onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block dark:text-gray-800 ">Unit</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-lg border-red-900 text-red-900 placeholder:text-gray-400 dark:bg-white"
                                placeholder="Enter Unit"
                                value={product.unit}
                                onChange={(e) => handleProductChange(index, 'unit', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block dark:text-gray-800 ">Quantity</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded-lg border-red-900 text-red-900 placeholder:text-gray-400 dark:bg-white"
                                placeholder="Enter Quantity"
                                value={product.quantity}
                                onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                            />
                        </div>
                        <button
                            className=""
                            onClick={() => handleRemoveProduct(index)}
                        >
                            <XMarkIcon className="flex w-8 ml-5 justify-center mt-4 text-red-500" />
                        </button>

                    </div>
                ))}
            </div>

            {/* Consignee Information */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold border-b pb-2 mb-4 dark:text-gray-800">Consignee Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                    <div>
                        <label className="block dark:text-gray-800">Consignee Name</label>
                        <input type="text" className="w-full p-2 border rounded-lg
                         border-red-900 text-red-900 placeholder:text-gray-400 dark:bg-white" placeholder="Enter Consignee's Name"
                            value={formData.consignee_name || ""}
                            onChange={(e) => handleInputChange(e, 'consignee_name')} required />
                    </div>
                    <div>
                        <label className="block dark:text-gray-800">Consignee Mobile</label>

                        <input
                            type="number"
                            className="w-full p-2 border rounded-lg border-red-900 text-red-900 placeholder:text-gray-400 dark:bg-white"
                            placeholder="Enter Consignee Mobile Number"
                            value={formData.consignee_mobile || ""}
                            maxLength={11}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                if (value.length <= 11) {
                                    handleInputChange(e, "consignee_mobile");
                                }
                            }}
                            required
                        />
                    </div>
                    <div>
                        <label className="block dark:text-gray-800">Consignee Email</label>
                        <input type="email" className="w-full p-2 border rounded-lg
                         border-red-900 text-red-900 placeholder:text-gray-400 dark:bg-white" placeholder="Enter Consignee Email"
                            value={formData.consignee_email || ""}
                            onChange={(e) => handleInputChange(e, 'consignee_email')} required />
                    </div>
                </div>
                <div>
                    <div>
                        <label className="block dark:text-gray-800">Address</label>
                        <input type="email" className="w-full p-2 border rounded-lg
                         border-red-900 text-red-900 placeholder:text-gray-400 dark:bg-white" placeholder="Enter Consignee Address"
                            value={formData.consignee_address || ""}
                            onChange={(e) => handleInputChange(e, 'consignee_address')} required />
                    </div>
                </div>
            </div>
            {/* Merchant Information */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold border-b pb-2 mb-4 dark:text-gray-800">Merchant Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                    <div>
                        <label className="block dark:text-gray-800">Merchant Name</label>
                        <input type="text" className="w-full p-2 border rounded-lg
                         border-red-900 text-red-900 placeholder:text-gray-400 dark:bg-white" placeholder="Enter Merchant's Name"
                            value={formData.merchant_name || ""}
                            onChange={(e) => handleInputChange(e, 'merchant_name')} required />
                    </div>
                    <div>
                        <label className="block dark:text-gray-800">Merchant Mobile</label>
                        <input
                            type="number"
                            className="w-full p-2 border rounded-lg border-red-900 text-red-900 placeholder:text-gray-400 dark:bg-white"
                            placeholder="Enter Merchant Mobile Number"
                            value={formData.merchant_mobile || ""}
                            maxLength={11}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                if (value.length <= 11) {
                                    handleInputChange(e, "merchant_mobile");
                                }
                            }}
                            required
                        />
                    </div>
                    <div>
                        <label className="block dark:text-gray-800">Merchant Email</label>
                        <input type="email" className="w-full p-2 border rounded-lg
                         border-red-900 text-red-900 placeholder:text-gray-400 dark:bg-white" placeholder="Enter Merchant Email"
                            value={formData.merchant_email || ""}
                            onChange={(e) => handleInputChange(e, 'merchant_email')} required />
                    </div>
                </div>
                <div>
                    <div>
                        <label className="block dark:text-gray-800">Address</label>
                        <input type="email" className="w-full p-2 border rounded-lg
                         border-red-900 text-red-900 placeholder:text-gray-400 dark:bg-white" placeholder="Enter Merchant Address"
                            value={formData.merchant_address || ""}
                            onChange={(e) => handleInputChange(e, 'merchant_address')} required />
                    </div>
                </div>
            </div>
            <div className="mb-6">
                <h2 className="text-lg font-semibold border-b pb-2 mb-4 dark:text-gray-800">Select Truck Type</h2>
                <div className="flex gap-4">
                    <label className="flex items-center dark:text-gray-800">
                        <input
                            type="checkbox"
                            className="mr-2 "
                            disabled={isCompanyVehiclesDisabled}
                            checked={showCompanyVehicles}
                            onChange={(e) => setShowCompanyVehicles(e.target.checked)}
                        />
                        Company Vehicles
                    </label>
                    <label className="flex items-center dark:text-gray-800">
                        <input
                            type="checkbox"
                            className="mr-2"
                            disabled={isSubcontractorsDisabled}
                            checked={showSubcontractors}
                            onChange={(e) => setShowSubcontractors(e.target.checked)}
                        />
                        Subcontractors
                    </label>
                </div>

                {showCompanyVehicles && (
                    <div className="mt-4">
                        <label className="block dark:text-gray-800 font-medium ">Select Company Vehicle</label>
                        <select
                            className="w-full p-2 border rounded-lg text-red-900 border-red-900 focus:ring-red-600 dark:bg-white"
                            value={formData.truck_type || ""}
                            onChange={(e) => handleInputChange(e, "truck_type")}
                        >
                            <option disabled>Select Company Vehicle</option>
                            {vehicles.length > 0 ? (
                                vehicles.map((vehicle, index) => (
                                    <option key={index} value={vehicle.truck_name}>
                                        {vehicle.truck_name}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No vehicles available</option>
                            )}
                        </select>
                    </div>
                )}


                {showSubcontractors && (
                    <div className="mt-4">
                        <div
                            className={`grid gap-2 ${subcontractors.length > 5 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4' : 'grid-cols-1'}`}
                        >
                            {subcontractors.length > 0 ? (
                                Array.from(new Set(subcontractors.map(subcontractor => subcontractor.company_name)))
                                    .map((uniqueCompanyName, index) => {
                                        const subcontractor = subcontractors.find(sub => sub.company_name === uniqueCompanyName);

                                        return (
                                            <label className="flex items-center" key={index}>
                                                <input
                                                    type="radio"
                                                    name="subcontractor"
                                                    className="mr-2 dark:text-gray-800"
                                                    value={subcontractor.company_name}
                                                    onChange={(e) => {
                                                        const selectedName = e.target.checked ? subcontractor.company_name : null;
                                                        setSelectedSubcontractor(selectedName);
                                                        setShowSubcontractorData(e.target.checked);
                                                    }}
                                                />
                                                <p className="dark:text-gray-800">
                                                    {subcontractor.company_name}
                                                </p>
                                            </label>
                                        );
                                    })
                            ) : (
                                <div>No subcontractors available</div>
                            )}
                        </div>

                        {showSubcontractorData && selectedSubcontractor && (
                            <div className="mt-4">
                                <label className="block dark:text-gray-800 font-medium">Select Truck Type</label>
                                <select
                                    className="w-full p-2 border rounded-lg text-red-900 border-red-900 focus:ring-red-600 dark:bg-white"
                                    value={formData.truck_type || ""}
                                    onChange={(e) => handleInputChange(e, "truck_type")}
                                >
                                    <option disabled>Select Truck Type</option>
                                    {subcontractors.length > 0 ? (
                                        subcontractors
                                            .filter(item => item.company_name === selectedSubcontractor)
                                            .map((item, index) => (
                                                <option
                                                    key={index}
                                                    value={`${item.company_name} - Capacity: ${item.truck_capacity} - Plate Number: ${item.plate_number}`}
                                                >
                                                    {item.company_name} - Capacity: {item.truck_capacity} - Plate Number: {item.plate_number}
                                                </option>
                                            ))
                                    ) : (
                                        <option value="">No Data</option>
                                    )}
                                </select>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="flex justify-end">
                <div className="w-full md:w-1/3">
                    <label className="block dark:text-gray-800 font-medium mb-1">Total Payment</label>
                    <input
                        type="number"
                        className="w-full p-2 border rounded-lg border-red-900 text-red-900 placeholder:text-gray-400 dark:bg-white"
                        value={formData.total_payment || ""}
                        placeholder="Enter Total Payment"
                        onChange={(e) => handleInputChange(e, 'total_payment')} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex justify-start">
                    <button
                        id="download-btn"
                        className={`bg-red-500 text-white px-4 py-2 rounded transition-opacity duration-300 ${!isFormValid ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'
                            }`}
                        disabled={!isFormValid}
                        onClick={() => handleDownload()}
                    >
                        Download Form
                    </button>

                </div>
                <div className="flex justify-end">
                    <button
                        id="submit-btn"
                        className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
                        ) : (
                            'Submit Form'
                        )}
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>

                        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
                            Booking QR Code
                        </h2>

                        <div className="mb-4 text-center">
                            <p className="text-lg font-semibold text-gray-800">
                                Tracking Number: {trackingNumber}
                            </p>
                        </div>

                        <div className="flex justify-center">
                            {qrCodeUrl ? (
                                <img src={qrCodeUrl} alt="QR Code" className="w-96 h-96 object-contain" />

                            ) : (
                                <p className="text-gray-500">Generating QR Code...</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}