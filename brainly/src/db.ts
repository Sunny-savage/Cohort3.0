import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const tagSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
});

const contentTypes = ["twitter","youtube"]; // Extend as needed

const contentSchema = new Schema({
  link: { type: String, required: true },
  type: { type: String, enum: contentTypes, required: true },
  title: { type: String, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: async function (value: mongoose.Schema.Types.ObjectId) {
      const user = await User.findById(value);
      if (!user) {
        throw new Error("User does not exist");
      }
    },
  },
});

const linkSchema = new mongoose.Schema({
  hash: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true , unique:true},
});

export const Content = mongoose.model("Content", contentSchema);
export const Link = mongoose.model("Link", linkSchema);
export const User = mongoose.model("User", userSchema);

export const Tag = mongoose.model("Tag", tagSchema);

// validate either by using validate key or presave hook

// contentSchema.pre('save', async function(next) {
//     const user = await User.findById(this.userId);
//     if (!user) {
//       throw new Error('User does not exist');
//     }
//     next();
//   });
