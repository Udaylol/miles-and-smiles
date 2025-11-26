class AuthController {
  async signin(req, res) {
    res.send("Signin is working :)");
  }
  async signup(req, res) {
    res.send("Signup is working :)");
  }
}

export default new AuthController();
