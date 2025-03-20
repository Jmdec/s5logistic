import { useState } from "react";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { toast, ToastContainer } from "react-toastify";

interface HeroUIProps {
    label: string;
}

const Export: React.FC<HeroUIProps> = ({ label }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const copyText = () => {
        navigator.clipboard.writeText(document.body.innerText).then(() => {
            toast.success("Content copied to clipboard!"); 
            setDropdownOpen(false); 
        }).catch((err) => {
            console.error("Error copying text: ", err);
            toast.error("Failed to copy text!"); 
        });
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const content = document.querySelector("table")?.outerHTML;

        if (content) {
            const logoUrl = "/S5Logo.png";
            const logoWidth = 30;
            const logoHeight = 30;

            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("S5 Logistics Inc.", 10, 10);

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text("New Cavite Industrial City, Maria St State Land, Manggahan, General Trias, Cavite", 10, 30);
            doc.text("s5logisticsInc.Cavite@gmail.com", 10, 20);

            doc.addImage(logoUrl, "PNG", 170, 10, logoWidth, logoHeight);

            const tableContent = document.createElement('div');
            tableContent.innerHTML = content;
            doc.html(tableContent, {
                callback: (doc) => {
                    doc.save("S5Logistics.pdf");
                    setDropdownOpen(false); 
                },
                margin: [25, 10, 10, 10],
                x: 10,
                y: 25,
                html2canvas: {
                    scale: 0.2,
                    useCORS: true,
                },
            });
        } else {
            doc.text("No table found!", 15, 15);
            doc.save("S5Logistics.pdf");
            setDropdownOpen(false); 
        }
    };

    const exportToExcel = () => {
        const table = document.querySelector("table");
        if (!table) return;

        const rows = Array.from(table.rows);
        const data = rows.map((row) =>
            Array.from(row.cells).map((cell) => cell.textContent || "")
        );

        const worksheet = XLSX.utils.aoa_to_sheet(data);

        worksheet["!cols"] = data[0].map(() => ({ wpx: 150 }));

        worksheet["!rows"] = data.map((_, idx) => (idx === 0 ? { hpt: 30 } : { hpt: 20 }));

        for (let col = 0; col < data[0].length; col++) {
            const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: col })];
            if (cell) {
                cell.s = { font: { bold: true } };
            }
        }

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, worksheet, "Sheet 1");
        XLSX.writeFile(wb, "S5logistics.xlsx");
        setDropdownOpen(false); 
    };

    const printPage = () => {
        const table = document.querySelector("table");
        if (!table) return;

        const printWindow = window.open('', '', 'height=600,width=900');

        if (printWindow) {
            printWindow.document.write('<html><head><title>S5 Logistics Inc.</title></head><body>');
            printWindow.document.write(table.outerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
            setDropdownOpen(false); 
        }
    };

    return (
        <div className="max-w-7xl mx-auto text-center">
            <div className="relative inline-block text-left">
                <button
                    type="button"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md flex items-center space-x-2 focus:outline-none"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    <span>{label}</span>
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                        ></path>
                    </svg>
                </button>

                {dropdownOpen && (
                    <div className="absolute right-0 z-10 mt-2 w-28 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1 rounded-md bg-white shadow-xs">
                            <a
                                href="#"
                                className="text-gray-700 block px-4 py-2 text-sm text"
                                onClick={copyText}
                            >
                                Copy
                            </a>
                            <a
                                href="#"
                                className="text-gray-700 block px-4 py-2 text-sm"
                                onClick={exportToPDF}
                            >
                                PDF
                            </a>
                            <a
                                href="#"
                                className="text-gray-700 block px-4 py-2 text-sm"
                                onClick={exportToExcel}
                            >
                                Excel
                            </a>
                            <a
                                href="#"
                                className="text-gray-700 block px-4 py-2 text-sm"
                                onClick={printPage}
                            >
                                Print
                            </a>
                        </div>
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default Export;
