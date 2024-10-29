import mysql from "mysql2/promise";

export default async function handler(req, res) {
    res.status(200).json({ name: "John Doe" });
}