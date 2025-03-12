import React from "react";

const DownloadCSV: React.FC = () => {
    const handleDownload = async (period: string) => {
        try {
            const response = await fetch(`http://localhost:5000/api/csv/download?period=${period}`, {
                method: "GET",
                headers: {
                    "Content-Type": "text/csv",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to download CSV");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `users_${period}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading CSV:", error);
        }
    };

    return (
        <div>
            <h2>Download User Report</h2>
            <button onClick={() => handleDownload("3days")}>Download Last 3 Days</button>
            <button onClick={() => handleDownload("7days")}>Download Last 7 Days</button>
            <button onClick={() => handleDownload("1month")}>Download Last 1 Month</button>
            <button onClick={() => handleDownload("2months")}>Download Last 2 Months</button>
            <button onClick={() => handleDownload("3months")}>Download Last 3 Months</button>
        </div>
    );
};

export default DownloadCSV;
