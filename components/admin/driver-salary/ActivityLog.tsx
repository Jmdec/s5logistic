import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";

interface LogData {
  id: number;
  activity: string;
  created_at: string;
}

interface UserData {
  name: string;
  email: string;
}

const ActivityLog = ({
  logData,
  userData,
  onClose,
}: {
  logData: LogData[];
  userData: UserData | null;
  onClose: () => void;
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="modal fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
      <div className="modal-content bg-white rounded-lg shadow-lg w-11/12 max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Close Button */}
        <div className="flex justify-end mb-4">
          <button className="p-2 w-10 h-10 rounded-full" onClick={onClose}>
            <XMarkIcon className="w-6 h-6 text-black-700" />
          </button>
        </div>

        {/* User Info Section */}
        {userData ? (
          <div className="mb-6 space-y-2 text-center">
            <p className="text-2xl font-bold">{userData.name}</p>
            <p className="text-sm text-black-500">{userData.email}</p>
          </div>
        ) : (
          <p className="text-center text-gray-500">No User</p>
        )}

        {/* Activity Logs Section */}
        <h2 className="text-2xl font-semibold mb-6 text-center border-b-2 pb-2">
          Activity Logs
        </h2>

        <div className="modal-body p-2 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-t-4 border-blue-500 items-center border-solid rounded-full animate-spin"></div>
            </div>
          ) : logData.length > 0 ? (
            <ul>
              {logData.map((log) => (
                <li
                  key={log.id}
                  className="flex justify-between items-center p-4 border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <div className="flex-1">
                    <span className="font-medium">{log.activity}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">
              No activity logs available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
