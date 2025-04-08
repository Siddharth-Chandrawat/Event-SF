import { configDotenv } from "dotenv";
import OracleDB from "oracledb";
configDotenv();

const connectDB = async () => {
    try {
        const connection = await OracleDB.getConnection({
            user:process.env.DB_USER,
            password:process.env.DB_PASSWORD,
            connectionString:process.env.DB_CONNECTION_STRING
        });
        console.log('Connected to Oracle database ✅');
        return connection;
    }
    catch (error) {
        console.log('connection to Oracle database failed ❌', error);
    }
}

export default connectDB;