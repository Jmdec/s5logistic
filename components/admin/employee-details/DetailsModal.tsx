import React from "react";

type EmployeeData = {
    id: number;
    employee_name: string;
    id_number: string;
    position: string;
    date_hired: string;
    birthday: string;
    birth_place: string;
    civil_status: string;
    gender: string;
    mobile: string;
    address: string;
    profile_image: string | null;
    files: File[];
    status: string;
};

type DetailsModalProps = {
    isOpenDetails: boolean;
    handleCloseModal: () => void;
    details: EmployeeData;
    title: string;
};

const DetailsModal: React.FC<DetailsModalProps> = ({
    isOpenDetails,
    handleCloseModal,
    details,
    title,
}) => {
    if (!isOpenDetails) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 sm:p-8 rounded-lg w-full max-w-lg max-h-[90vh] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button
                        onClick={handleCloseModal}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        X
                    </button>
                </div>

                {/* Profile Image */}
                {details.profile_image && (
                    <div className="flex justify-center mb-4">
                        <img
                            src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${details.profile_image}`}
                            alt="Profile"
                            className="rounded-full w-32 h-32 object-cover border-2 border-gray-200 shadow-md"
                        />
                    </div>
                )}

                {/* Modal Content */}
                <div>
                    <div className="mb-2">
                        <strong>Name:</strong> {details.employee_name}
                    </div>
                    <div className="mb-2">
                        <strong>Position:</strong> {details.position}
                    </div>
                    <div className="mb-2">
                        <strong>ID Number:</strong> {details.id_number}
                    </div>
                    <div className="mb-2">
                        <strong>Mobile:</strong> {details.mobile}
                    </div>
                    <div className="mb-2">
                        <strong>Birthday:</strong> {details.birthday}
                    </div>
                    <div className="mb-2">
                        <strong>Birthplace:</strong> {details.birth_place}
                    </div>
                    <div className="mb-2">
                        <strong>Civil Status:</strong> {details.civil_status}
                    </div>
                    <div className="mb-2">
                        <strong>Gender:</strong> {details.gender}
                    </div>
                    <div className="mb-2">
                        <strong>Date Hired:</strong> {details.date_hired}
                    </div>
                    <div className="mb-2">
                        <strong>Address:</strong> {details.address}
                    </div>

                    {/* Files Section */}
                    {/* {details.files.length > 0 && (
                        <div className="mt-4">
                            <strong>Files:</strong>
                            <ul>
                                {details.files.map((file, index) => (
                                    <li key={index}>
                                        <a
                                            href={URL.createObjectURL(file)} // Convert File to URL
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            File {index + 1}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )} */}

                </div>
            </div>
        </div>
    );
};

export default DetailsModal;
