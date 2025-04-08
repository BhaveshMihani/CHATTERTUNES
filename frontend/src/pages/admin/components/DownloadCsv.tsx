import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DatePicker from "@/components/ui/DatePicker"; 
import { File } from "lucide-react";


const DownloadCSV: React.FC = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<string>("");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const handleDownload = async () => {
        if (!startDate || !endDate) {
            console.error("Start date and end date must be selected");
            return;
        }

        try {
            const response = await fetch(`api/csv/download?report=${selectedReport}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`, {
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
            a.download = `${selectedReport}_${startDate.toISOString()}_${endDate.toISOString()}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading CSV:", error);
        }
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button className='bg-cyan-500 hover:bg-cyan-600 text-black'>
                   <File/> Reports
                </Button>
            </DialogTrigger>

            <DialogContent className='bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto'>
                <DialogHeader>
                    <DialogTitle>Download Report</DialogTitle>
                    <DialogDescription>Select the type and period for the report</DialogDescription>
                </DialogHeader>

                <div className='space-y-4 py-4'>
                    <div className='space-y-2'>
                        <label className='text-sm font-medium'>Select Report Type</label>
                        <Select
                            value={selectedReport}
                            onValueChange={(value) => setSelectedReport(value)}
                        >
                            <SelectTrigger className='bg-zinc-800 border-zinc-700'>
                                <SelectValue placeholder='Select report type' />
                            </SelectTrigger>
                            <SelectContent className='bg-zinc-800 border-zinc-700'>
                                <SelectItem value='user'>User Report</SelectItem>
                                <SelectItem value='song'>Song Report</SelectItem>
                                <SelectItem value='album'>Album Report</SelectItem>
                                <SelectItem value='subscription'>Subscription Report</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='flex space-x-4'>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium'>Select Start Date</label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date: Date | null) => setStartDate(date)}
                                className='bg-zinc-800 border-zinc-700 text-white'
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium'>Select End Date</label>
                            <DatePicker
                                selected={endDate}
                                onChange={(date: Date | null) => setEndDate(date)}
                                className='bg-zinc-800 border-zinc-700 text-white'
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant='outline' onClick={() => setDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleDownload} disabled={!startDate || !endDate || !selectedReport}>
                        Download
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DownloadCSV;
