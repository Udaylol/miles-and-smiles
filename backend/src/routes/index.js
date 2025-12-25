import authRoutes from './authRoute.js';
import userRoutes from './userRoute.js';
import friendRoutes from './friendRoute.js';
import gameRoutes from './gameRoute.js';

const Routes = {
  auth: authRoutes,
  user: userRoutes,
  friend: friendRoutes,
  game: gameRoutes,
};

export default Routes;
