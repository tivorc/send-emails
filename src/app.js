const express = require("express");
const nodemailer = require("nodemailer");

const SERVER_PORT = process.env.PORT;
const app = express();

app.use(express.json());

let transporter = nodemailer.createTransport({
	host: process.env.MAIL_SERVER_NAME,
	secure: false,
	port: parseInt(process.env.MAIL_SERVER_PORT),
	auth: {
		user: process.env.USER_MAIL_NAME,
		pass: process.env.USER_MAIL_PASSWORD,
	},
	tls: {
		ciphers: "SSLv3",
	},
});

app.get("/", (_, res) => res.json({ ok: true }));

app.post("/send", async function (req, res) {
	const { to, subject, message } = req.body;
	try {
		await transporter.sendMail({
			from: `${process.env.USER_NAME} <${process.env.USER_MAIL_NAME}>`,
			to: to,
			subject: subject,
			text: message,
			attachments: [
				{
					filename: "text1.txt",
					content: message,
				},
			],
			html: `<img src="https://source.unsplash.com/random/150x60" height="70px" /><p>${message}</p>`,
		});
		res.json({ ok: true });
	} catch (error) {
		res.json({ ok: false, message: error.message });
	}
});

app.listen(SERVER_PORT, () => console.log("server running"));
