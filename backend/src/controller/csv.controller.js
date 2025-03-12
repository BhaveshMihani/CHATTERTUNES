import moment from "moment";
import { User } from "../models/user.model.js";
import { Parser } from "json2csv";

export const generateCsvReport = async (req, res) => {
    try {
        const { period } = req.query;
        console.log("Received period:", period);

        // Valid periods
        const validPeriods = ["3days", "7days", "1month", "2months", "3months"];
        const cleanedPeriod = period.trim();  // Trim spaces and newlines

        console.log("Received period:", `"${cleanedPeriod}"`);
        console.log("Valid periods:", validPeriods);
        console.log("Is period valid?", validPeriods.includes(cleanedPeriod));

        if (!cleanedPeriod || !validPeriods.includes(cleanedPeriod)) {
            return res.status(400).json({ error: "Invalid period parameter" });
        }

        let startDate;
        if (period.includes("days")) {
            const daysAgo = parseInt(period.replace("days", ""), 10);
            startDate = moment().subtract(daysAgo, "days").toDate(); // Users from last X days
        } else {
            const monthsAgo = parseInt(period.replace("months", "").replace("month", ""), 10);
            startDate = moment().subtract(monthsAgo, "months").startOf("month").toDate(); // Users from start of the selected month
        }

        console.log(`Fetching users created after: ${startDate}`);

        const users = await User.find({ createdAt: { $gte: startDate } });

        if (users.length === 0) {
            return res.status(200).json({ message: "No users found for this period" });
        }

        // Convert JSON to CSV
        const fields = ["fullName", "imageUrl", "clerkId", "createdAt"];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(users);

        res.header("Content-Type", "text/csv");
        res.attachment("users-report.csv");
        res.send(csv);
    } catch (error) {
        console.error("Error generating CSV:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
