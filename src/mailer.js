import nodemailer from "nodemailer";

const from = '"Rei Analyze" <info@reianalyze.com>';

function setup() {
	return nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS
		}
	});
}

export function sendResetPasswordEmail(user) {
	const tranport = setup();
	const email = {
		from,
		to: user.email,
		subject: "Reset Password",
		text: `
    To reset password follow this link
    ${user.generateResetPasswordLink()}
    `
	};

	tranport.sendMail(email);
}
