import User from '../models/User';

export const validateOTP = async (req, res, next) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Usuário não encontrado.' });
        }

        if (!user.resetPasswordToken || user.resetPasswordToken !== otp) {
            return res.status(400).json({ message: 'Token inválido ou expirado.' });
        }

        if (user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: 'Token expirado.' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Erro ao validar OTP:', error.message);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};