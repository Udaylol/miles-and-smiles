import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    maxPlayers: {
      type: Number,
      required: true,
    },

    logo: {
      type: String,
      default: null,
    },

    description: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

const Game = mongoose.model("Game", gameSchema);
export default Game;
