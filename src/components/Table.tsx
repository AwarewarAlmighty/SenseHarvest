import { useState } from "react";

// Define the type for an inventory item
interface InventoryItem {
  name: string;
  place: string;
  amount: string;
}

// Define the data for the table
const TABLE_HEAD = ["Name", "Place", "Amount", ""];

const TABLE_ROWS: InventoryItem[] = [
  {
    name: "Hydroponics Unit 1",
    place: "Greenhouse A",
    amount: "150 plants",
  },
  {
    name: "Soil Moisture Sensor",
    place: "Field B",
    amount: "N/A",
  },
  {
    name: "IoT Weather Station",
    place: "Farm Entrance",
    amount: "N/A",
  },
  {
    name: "Water Pump System",
    place: "Reservoir C",
    amount: "1 unit",
  },
  {
    name: "Automated Sprinkler",
    place: "Field D",
    amount: "1 system",
  },
];

export default function DefaultTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<InventoryItem | null>(null);
  const [editedPlace, setEditedPlace] = useState("");
  const [editedAmount, setEditedAmount] = useState("");

  const handleEditClick = (rowData: InventoryItem) => {
    setSelectedRow(rowData);
    setEditedPlace(rowData.place);
    setEditedAmount(rowData.amount);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    // In a real application, you would update your data source here
    // For this example, we'll just log the new data
    console.log("Saving changes for:", selectedRow?.name);
    console.log("New Place:", editedPlace);
    console.log("New Amount:", editedAmount);
    // Here you would likely make an API call to update the record

    // Then, close the modal and reset state
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  return (
    <div className="p-4 bg-card shadow-md rounded-lg overflow-x-auto">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr className="bg-gray-50">
            {TABLE_HEAD.map((head, index) => (
              <th key={index} className="p-4 border-b border-gray-200">
                <p className="font-semibold text-sm text-muted-foreground leading-none opacity-70">
                  {head}
                </p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TABLE_ROWS.map((rowData: InventoryItem, index) => {
            const isLast = index === TABLE_ROWS.length - 1;
            const classes = `p-4 ${isLast ? "" : "border-b border-gray-200"}`;

            return (
              <tr key={rowData.name}>
                <td className={classes}>
                  <p className="font-normal text-sm text-foreground">
                    {rowData.name}
                  </p>
                </td>
                <td className={classes}>
                  <p className="font-normal text-sm text-foreground">
                    {rowData.place}
                  </p>
                </td>
                <td className={classes}>
                  <p className="font-normal text-sm text-foreground">
                    {rowData.amount}
                  </p>
                </td>
                <td className={classes}>
                  <button
                    onClick={() => handleEditClick(rowData)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.652.885a.75.75 0 01-.9-1.091l.885-2.652a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-card p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Edit Inventory: {selectedRow?.name}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <div className="mb-4">
                <label className="block text-foreground text-sm font-bold mb-2">
                  Place
                </label>
                <input
                  type="text"
                  value={editedPlace}
                  onChange={(e) => setEditedPlace(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-6">
                <label className="block text-foreground text-sm font-bold mb-2">
                  Amount
                </label>
                <input
                  type="text"
                  value={editedAmount}
                  onChange={(e) => setEditedAmount(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
