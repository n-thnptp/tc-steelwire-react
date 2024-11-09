import mysql from "mysql2/promise";

let dbconnection;

export default async function query(query, values = []) {
    if (!dbconnection)
        dbconnection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

    try {
        const [results] = await dbconnection.execute(query, values);
        return results
    } catch (error) {
        throw Error(error.message);
    }
}