const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("users", UserSchema);

const TodoSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      ref: UserModel,
    },
    title: {
      type: String,
    },
    done: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const TodoModel = mongoose.model("todos", TodoSchema);

module.exports = {
  TodoModel,
  UserModel,
};
