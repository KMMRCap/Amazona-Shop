import nc from 'next-connect'
import db from '../../utils/db'
import Product from '../../models/Product'
import User from '../../models/User'
import data from '../../utils/data'

const handler = nc()

handler.get(async (req, res) => {
    await db.connect()
    await User.deleteMany()
    await User.insertMany(data.users)
    await Product.deleteMany()
    await Product.insertMany(data.products)
    await db.disconnect()
    res.send({ messgae: 'seeded successfully' })
})

export default handler