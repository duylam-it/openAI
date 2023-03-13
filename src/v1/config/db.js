import mongoose from "mongoose";
const { connect: _connect } = mongoose;

function connect() {
  try {
    _connect(process.env.DB_HOST, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`Connected to MongoDB (${process.env.DB_HOST})`);
  } catch (err) {
    console.warn("Mongoose Connection ERROR: " + err.message);
  }
}

export default { connect };
