import Express, { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { pool } from "../../src/config/database";
import Joi from "joi";
import { v4 as uuidv4 } from "uuid";

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

//Generate UUID for entries
const generateUUID = () => {
  const uuid = uuidv4().replace(/-/g, "").substring(0, 8);
  return `UI${uuid}`;
};

//Get cafes based on location or all if none
//Ordered DESC based on employee count
const cafeGetHandler: RequestHandler = async (req, res) => {
  const connection = await pool.getConnection();
  try {
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

    return res.status(StatusCodes.OK).json({ cafes: rows });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  } finally {
    connection.release();
  }
};

//Add cafe to database
const cafePostHandler: RequestHandler = async (req, res) => {
  const { error } = cafeSchema.validate(req.body);

  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: error.details[0].message });
  }
  const connection = await pool.getConnection();
  try {
    //Since mySQL does not support sequence, I've stored the number in a table
    //Get the current counter from the database and create UUID

    const UUID = generateUUID();

    const insertQuery = `INSERT INTO cafe (id, name, description, logo, location) VALUES (?, ?, ?, ?, ?)`;
    const body = [
      UUID,
      req.body.name,
      req.body.description,
      req.body.logo,
      req.body.location,
    ];

    // Execute the single query
    const [result]: any = await connection.execute(insertQuery, body);

    if (result.affectedRows > 0) {
      return res.status(StatusCodes.OK).send("Cafe added successfully.");
    } else {
      throw new Error("Database error");
    }
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  } finally {
    connection.release();
  }
};

//Update an Cafe details
const cafePutHandler: RequestHandler = async (req, res) => {
  const { error } = cafeSchema.validate(req.body);

  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: error.details[0].message });
  }
  const connection = await pool.getConnection();
  try {
    const cafeId = req.params.id;
    const updatedData = req.body;
    //get employee data
    const [rows]: any = await connection.execute(
      "SELECT * FROM cafe WHERE id = ?",
      [cafeId]
    );
    if (rows.length === 0) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Cafe not found" });
      return;
    }
    const cafeData = rows[0];
    //Update cafe data
    const mergedData = { ...cafeData, ...updatedData };
    delete mergedData.id;

    const updateQuery = `UPDATE cafe SET name = ?, description = ?,logo = ?, location = ? WHERE id = ?`;
    const [update]: any = await connection.execute(updateQuery, [
      mergedData.name,
      mergedData.description,
      mergedData.logo,
      mergedData.location,
      cafeId,
    ]);

    if (update.affectedRows > 0) {
      res.status(StatusCodes.OK).json({ message: "Cafe updated successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.code });
  } finally {
    connection.release();
  }
};

//Delete a cafe
const cafeDeleteHandler: RequestHandler = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const employeeId = req.params.id;
    const deleteQuery = `DELETE FROM cafe WHERE id = ?`;
    const [result]: any = await connection.execute(deleteQuery, [employeeId]);

    if (result.affectedRows > 0) {
      res.status(StatusCodes.OK).json({ message: "cafe deleted" });
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_GATEWAY).json({ message: error.code });
  } finally {
    connection.release();
  }
};
CafeController.get("/cafe", cafeGetHandler);
CafeController.post("/cafe", cafePostHandler);
CafeController.put("/cafe/:id", cafePutHandler);
CafeController.delete("/cafe/:id", cafeDeleteHandler);

export default CafeController;
