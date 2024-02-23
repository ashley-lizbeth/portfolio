import nodemailer from 'nodemailer'
import validator from 'validator'

import type { APIContext } from 'astro'

export const prerender = false

const transporter = nodemailer.createTransport({
	service: 'gmail',
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: import.meta.env.EMAIL_USER,
		pass: import.meta.env.EMAIL_PASSWORD,
	},
})

async function send_email(name: string, email: string, message: string) {
	if (
		!validator.isAscii(name) ||
		!validator.isEmail(email) ||
		!validator.isAscii(message)
	) {
		throw new Error('The data you submited is invalid.')
	}
	const info = await transporter.sendMail({
		from: `${name} <${email}>`,
		to: import.meta.env.EMAIL_USER,
		subject: `Message from ${name}`,
		text: `Message from ${name}, with email ${email}.\n${message}`,
	})

	if (!info.accepted) {
		throw new Error('Your email was not sent correctly')
	}
}

function validateCSRF(token: string, cookie: string) {
	const token_has_apropriate_length = validator.isLength(token, {
		min: 36,
		max: 36,
	})
	const cookie_has_apropriate_length = validator.isLength(cookie, {
		min: 36,
		max: 36,
	})
	const token_equals_cookie = validator.equals(cookie, token)
	return (
		token_has_apropriate_length &&
		cookie_has_apropriate_length &&
		token_equals_cookie
	)
}

export async function POST({ request }: APIContext) {
	const { csrf_token, name, email, message } = await request.json()

	const csrf_cookie = request.headers.get('X-CSRFtoken') ?? ''

	try {
		if (!validateCSRF(csrf_token, csrf_cookie)) {
			throw new Error('Bad CSRF Token')
		}

		await send_email(name, email, message)
	} catch (e) {
		if (!(e instanceof Error)) {
			e = new Error('There was an error on the server')
		}
		return new Response((e as Error).message, { status: 401 })
	}

	return new Response('Email sent')
}
