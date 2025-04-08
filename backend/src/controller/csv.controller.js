import moment from "moment";
import { User } from "../models/user.model.js";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import Subscription  from "../models/subscription.model.js";
import { Parser } from "json2csv";

export const generateCsvReport = async (req, res) => {
    try {
        const { startDate, endDate, report } = req.query;
        console.log("Received startDate:", startDate);
        console.log("Received endDate:", endDate);
        console.log("Received report:", report);

        // Valid reports
        const validReports = ["user", "song", "album", "subscription"];
        const cleanedReport = report.trim();

        console.log("Received report:", `"${cleanedReport}"`);
        console.log("Valid reports:", validReports);
        console.log("Is report valid?", validReports.includes(cleanedReport));

        if (!startDate || !endDate || !cleanedReport || !validReports.includes(cleanedReport)) {
            return res.status(400).json({ error: "Invalid date range or report parameter" });
        }

        const start = moment(startDate).startOf('day').toDate();
        const end = moment(endDate).endOf('day').toDate();

        console.log(`Fetching ${report} records created between: ${start} and ${end}`);

        let records;
        let fields;
        if (report === "user") {
            records = await User.find({ createdAt: { $gte: start, $lte: end } });
            fields = ["fullName", "imageUrl", "clerkId", "createdAt"];
        } else if (report === "song") {
            records = await Song.find({ createdAt: { $gte: start, $lte: end } }).populate('albumId', 'title');
            fields = ["title", "artist", "albumId.title", "createdAt"];
        } else if (report === "album") {
            records = await Album.find({ createdAt: { $gte: start, $lte: end } });
            fields = ["title", "artist", "releaseYear", "createdAt"];
        } else if (report === "subscription") {
            records = await Subscription.find({ createdAt: { $gte: start, $lte: end } });
            fields = ["userId", "priceId", "status", "createdAt"];
        }

        if (records.length === 0) {
            return res.status(200).json({ message: `No ${report} records found for this period` });
        }

        // Convert JSON to CSV
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(records);

        res.header("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="${report}-report.csv"`);
        res.send(csv);
    } catch (error) {
        console.error("Error generating CSV:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
