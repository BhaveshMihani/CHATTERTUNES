import { User } from "../models/user.model.js";

export const authCallback = async (req, res, next) => {
  try {
    console.log('authCallback function accessed');  
    const event = req.body;
    console.log('Received event:', event);  

    if (event.type === 'user.created') {
      const { id, email_addresses, first_name, last_name, image_url } = event.data;

      const email = email_addresses.length > 0 ? email_addresses[0].email_address : '';

      const user = await User.findOne({ clerkId: id });

      if (!user) {
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

    } else if (event.type === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url } = event.data;

      const email = email_addresses.length > 0 ? email_addresses[0].email_address : '';

      const updatedUser = await User.findOneAndUpdate(
        { clerkId: id },
        {
          email,
          fullName: `${first_name} ${last_name}`,
          imageUrl: image_url,
        },
        { new: true }
      );

      if (updatedUser) {
        console.log('User updated:', updatedUser);
      } else {
        console.log('User not found for update:', id);
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error in auth callback", error);
    next(error);
  }
};
