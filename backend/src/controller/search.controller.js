import { Song } from "../models/song.model.js";

export const searchSongs = async (req, res, next) => {
    const { query, page = 1, limit = 10 } = req.query;  
    console.log("Received search query:", query); 

    if (!query) {
        return res.status(400).json({ message: "Query parameter is missing" });
    }

    try {
        const searchRegex = new RegExp(query, 'i');
        const offset = (page - 1) * limit;  
        const results = await Song.find({
            $or: [
                { title: { $regex: searchRegex } },
                { artist: { $regex: searchRegex } },
                { Genres: { $in: [searchRegex] } }  // Adjusted search for Genres
            ]
        })
        .skip(offset)  
        .limit(parseInt(limit))  
        .sort({ title: 1 });  

        const totalResults = await Song.countDocuments({
            $or: [
                { title: { $regex: searchRegex } },
                { artist: { $regex: searchRegex } },
                { Genres: { $in: [searchRegex] } }  // Adjusted search for Genres
            ]
        });

        console.log("Search results:", results);  
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