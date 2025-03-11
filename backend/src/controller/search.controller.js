import { Song } from "../models/song.model.js";

export const searchSongs = async (req, res, next) => {
    const { query, page = 1, limit = 10 } = req.query;  // Added pagination parameters
    console.log("Received search query:", query);  // Log the received query

    if (!query) {
        // If the query parameter is missing, return an error response
        return res.status(400).json({ message: "Query parameter is missing" });
    }

    try {
        const searchRegex = new RegExp(query, 'i');  // Create a case-insensitive regex for partial matches
        const offset = (page - 1) * limit;  // Calculate the offset for pagination

        const results = await Song.find({
            $or: [
                { title: { $regex: searchRegex } },
                { artist: { $regex: searchRegex } }
            ]
        })
        .skip(offset)  // Skip results based on the offset
        .limit(parseInt(limit))  // Limit the number of results
        .sort({ title: 1 });  // Sort results by title (alphabetically)

        const totalResults = await Song.countDocuments({
            $or: [
                { title: { $regex: searchRegex } },
                { artist: { $regex: searchRegex } }
            ]
        });

        console.log("Search results:", results);  // Log the search results
        res.status(200).json({
            totalResults,
            currentPage: page,
            totalPages: Math.ceil(totalResults / limit),
            results
        });
    } catch (error) {
        console.error("Error in searchSongs:", error);
        next(error);
    }
};