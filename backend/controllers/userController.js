class UserController {
  async getMe(req, res) {
    res.send("GetMe is working :)");
  }
  async updateUser(req, res) {
    res.send("UpdateUser is working :)");
  }
}

export default new UserController();
