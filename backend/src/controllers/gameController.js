import { games } from "../data/games.js";
import { sendResponse } from "../utils/response.js";

class GameController {
  static async getAllGames(req, res) {
    return sendResponse(
      res,
      200,
      true,
      "Games fetched successfully",
      games
    );
  }
}

export default GameController;
