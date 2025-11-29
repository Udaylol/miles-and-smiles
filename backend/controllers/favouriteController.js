import Game from "../models/Game.js";

class FavouriteController {
  // ---------------------- ADD FAVOURITE ----------------------
  static async addFavourite(req, res) {
    try {
      const user = req.user;
      const { gameId } = req.params;

      const gameExists = await Game.exists({ _id: gameId });
      if (!gameExists) {
        return res.status(404).json({
          success: false,
          message: "Game not found",
          data: null,
        });
      }

      if (user.favourites.includes(gameId)) {
        return res.status(200).json({
          success: true,
          message: "Game already in favourites",
          data: user.favourites,
        });
      }

      user.favourites.push(gameId);
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Game added to favourites",
        data: user.favourites,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Error adding favourite",
        data: null,
      });
    }
  }

  // ---------------------- REMOVE FAVOURITE ----------------------
  static async deleteFavourite(req, res) {
    try {
      const user = req.user;
      const { gameId } = req.params;

      if (!user.favourites.includes(gameId)) {
        return res.status(200).json({
          success: true,
          message: "Game already removed from favourites",
          data: user.favourites,
        });
      }

      user.favourites = user.favourites.filter(
        (id) => id.toString() !== gameId.toString()
      );
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Game removed from favourites",
        data: user.favourites,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Error removing favourite",
        data: null,
      });
    }
  }
}

export default FavouriteController;
