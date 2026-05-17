'use server'

import { getSessionUser } from '@/utils/getSessionUser'
import connectDB from '@/database'
import Order from '@/models/orderModel'

export async function getUserOrders() {
    await connectDB();

    const sessionUser = await getSessionUser()
    if(!sessionUser?.userId){
        throw new Error ('User id is required')
    }
    
    const userOrders = await Order.find({
        user: sessionUser?.userId,
    }).sort({
        createdAt: -1
    });

    return JSON.parse(JSON.stringify(userOrders));
  
}

export default getUserOrders
