/** @format */
import mongoose from 'mongoose'

const connectDB = async () => {
	mongoose.set('strictQuery', true)

	if (!process.env.MONGO_URI) {
		throw new Error('MONGO_URI is not set in environment variables')
	}

	// readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
	const { readyState } = mongoose.connection
	if (readyState === 1) {
		console.log('Already connected to database')
		return
	}

	try {
		await mongoose.connect(process.env.MONGO_URI)
		console.log('Connected to database')
	} catch (error) {
		console.log('Error connecting to database', error)
		// Fail fast so Mongoose doesn't buffer and timeout later
		throw error
	}
}

export default connectDB;

