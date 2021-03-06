
module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const UserSchema = new Schema({
    email: { type: String, required: true },
    passwd: { type: String, required: true, select: false },
    userName: { type: String, required: true },
    avatar: { type: String, required: false, default: '/user.png' },
  }, { timestamps: true })
  return mongoose.model('User', UserSchema)
}
