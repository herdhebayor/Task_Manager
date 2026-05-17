/** @format */

import { Schema, model, models } from 'mongoose'

const UserSchema = new Schema(
	{
		email: {
			type: String,
			unique: [true, 'Email already exists'],
			required: [true, 'Email is required'],
		},
		username: {
			type: String,
			required: [true, 'Username is required'],
		},
		image: {
			type: String,
		},
		address:{
			type: String,
			default: '',
		},
		phone :{
			type: String,
			default: '',
		},
		password:{
			type: String,
			default: '',
		},
		role:{
			type: String,
			default:'user',
		},
		provider: {
			type: String,
			default: "credentials"
		},
		sex:{
			type: String,
			default: 'male',
		}
	},
	{ timestamps: true }
)
const User = models.User || model('User', UserSchema)

export default User