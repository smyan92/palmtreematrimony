// Ensure user can only update their own profile
const verifyOwnership = (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ message: 'Forbidden: You can only update your own profile' });
  }
  next();
};

module.exports = verifyOwnership;
