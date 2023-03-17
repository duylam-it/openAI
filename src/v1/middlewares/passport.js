import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { ACCESS_TOKEN_SECRET } from "../config/variable.js";

passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Authorization"),
      secretOrKey: ACCESS_TOKEN_SECRET,
    },
    (payload, done) => {
      if (payload.sub !== "GDVN") return done(null, false);
      else return done(null, payload);
    }
  )
);

export default passport;
