export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body; // Accept role

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Please provide email, password, and role" });
    }

    // Find user by email AND role
    const user = await User.findOne({ email, role });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createToken(user);

    res.json({ user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};