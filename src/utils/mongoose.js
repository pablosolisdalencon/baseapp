import { connect, connection } from 'mongoose';

const conn = {
    isConnected: false
}

export async function connectDB(){
    if(conn.isConnected) return;


    const db = await connect(process.env.MONGODB_URI || 'mongodb+srv://pablosolisdalencon:cyberpunk1@cluster0.sjwvczm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log(db.connection.db.databaseName)
    conn.isConnected = db.connections[0].readyState
}

connection.on('connected', () => {
    console.log('Mongoose is connected')
})

connection.on('error', (err) => {
    console.log('Mongoose connection error: ', err)
})
