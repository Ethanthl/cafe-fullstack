import Express, { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { pool } from "../../src/config/database";
import Joi from "joi";

const CafeController = Express.Router();

//Check if logos are base64 format
const base64Validator: Joi.CustomValidator<string> = (value, helpers) => {
  if (value === "" || !/^data:image\/\w+;base64,/.test(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

const cafeSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  location: Joi.string().required(),
  logo: Joi.string().custom(base64Validator).allow(""),
});

const cafeGetHandler: RequestHandler = async (req, res) => {
  const connection = await pool.getConnection();
  const location = "%" + req.query.location + "%";
  // switch queries based on location param provided
  const selectQuery = req.query.location
    ? `SELECT c.*, COUNT(e.id) AS employees FROM cafe c LEFT JOIN employee e ON c.id = e.cafe_id
    WHERE location LIKE ?  GROUP BY c.id
    ORDER BY employees DESC;`
    : `SELECT c.*, COUNT(e.id) AS employees
    FROM cafe c
    LEFT JOIN employee e ON c.id = e.cafe_id
    GROUP BY c.id
    ORDER BY employees DESC;`;

  const [rows]: any = await connection.execute(selectQuery, [location]);

  console.log(rows);

  return res.sendStatus(StatusCodes.OK);
};

const cafePostHandler: RequestHandler = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { error } = cafeSchema.validate(req.body);

    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: error.details[0].message });
    }

    //Since mySQL does not support sequence, I've stored the number in a table
    //Get the current counter from the database and create UUID
    const [rows]: any = await connection.execute(
      "SELECT counter FROM counter_table WHERE id = 1"
    );
    const currentCounter = rows[0].counter;
    const UUID = "UI" + currentCounter;

    console.log(UUID);

    const insertQuery = `INSERT INTO cafe (id, name, description, logo, location) VALUES (?, ?, ?, ?, ?)`;

    // Execute the single query
    const [result]: any = await connection.execute(insertQuery, [
      UUID,
      req.body.name,
      req.body.description,
      req.body.logo,
      req.body.location,
    ]);

    if (result.affectedRows > 0) {
      console.log("Insertion successful.");

      // Update the counter value in the database
      const [update]: any = await connection.execute(
        "UPDATE counter_table SET counter = counter + 1 WHERE id = 1"
      );

      console.log("Counter updated.");
      res.status(StatusCodes.OK).send("Cafe added successfully.");
    } else {
      throw new Error("Database error");
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  } finally {
    connection.release();
  }
};

CafeController.get("/cafe", cafeGetHandler);
CafeController.post("/cafe", cafePostHandler);

export default CafeController;
