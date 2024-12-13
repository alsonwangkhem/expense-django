import { useEffect, useState } from 'react'
import axios from 'axios'

function ExpenseTracker({ serverUrl }) {
  const [file, setFile] = useState(null);
  const [monthlySpending, setMonthlySpending] = useState([]);

  useEffect(() => {
    fetchMonthlySpending();
  }, [])

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async(event) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a file first.");
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post(`${serverUrl}/api/upload_csv/`, formData, {
        headers: {
          'Content-Type' : 'multipart/form-data',
        }
      });
      alert("File uploaded successfully");
      fetchMonthlySpending();
    } catch(error) {
      console.error("Error uploading the file: ", error);
      alert("Failed to upload the file");
    }
  };

  const fetchMonthlySpending = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/get_monthly_spending/`);
      setMonthlySpending(response.data);
      console.log(monthlySpending)
    } catch(error) {
      console.error("Error fetching monthly spending data: ", error);
      alert("Failed to fetch spending data.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Spending Tracker</h1>
        
        {/* File Upload Form */}
        <form onSubmit={handleFileUpload} className="mb-8 flex flex-col items-center space-y-4">
          <label className="text-lg font-medium text-gray-700">
            Upload CSV:
          </label>
          <input 
            type='file' 
            accept='.csv' 
            onChange={handleFileChange} 
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button 
            type='submit' 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300"
          >
            Upload
          </button>
        </form>

        {/* Monthly Spending Table */}
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Monthly Spending</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody>
              {monthlySpending.length > 0 ? (
                monthlySpending.map((item, index) => (
                  <tr 
                    key={index} 
                    className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">{item.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.description}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ExpenseTracker;
