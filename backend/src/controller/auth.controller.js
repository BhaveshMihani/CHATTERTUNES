import { User } from "../models/user.model.js";

export const authCallback = async (req, res, next) => {
  try {
    console.log('authCallback function accessed');  // Log function access
    const event = req.body;
    console.log('Received event:', event);  // Log the received event

    if (event.type === 'user.created') {
      const { id, email_addresses, first_name, last_name, image_url } = event.data;

      // Extract email from email_addresses array
      const email = email_addresses.length > 0 ? email_addresses[0].email_address : '';

      // Check if user already exists
      const user = await User.findOne({ clerkId: id });

      if (!user) {
        // Create new user
        const newUser = new User({
          clerkId: id,
          email,
          fullName: `${first_name} ${last_name}`,
          imageUrl: image_url,
        });
        await newUser.save();
        console.log('User created:', newUser);
      } else {
        console.log('User already exists:', user);
      }

    } else if (event.type === 'user.deleted') {
      const { id } = event.data;
      await User.findOneAndDelete({ clerkId: id });
      console.log('User deleted:', id);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error in auth callback", error);
    next(error);
  }
};
