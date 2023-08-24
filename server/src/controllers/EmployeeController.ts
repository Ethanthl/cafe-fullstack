import Express, { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { pool } from "../../src/config/database";
import Joi from "joi";
import { v4 as uuidv4 } from "uuid";
const EmployeeController = Express.Router();

const generateUUID = () => {
  const uuid = uuidv4().replace(/-/g, "").substring(0, 8);
  return `UI${uuid}`;
};
//Custom phone number validation
const phoneValidator: Joi.CustomValidator<string> = (value, helpers) => {
  if (!/^[89]\d{7}$/.test(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

//validation
const employeeSchema = Joi.object({
  name: Joi.string().required(),
  email_address: Joi.string().email().required(),
  phone_number: Joi.string().custom(phoneValidator).required(),
  gender: Joi.string().required(),
});

//This handler gets employees of a cafe if cafe is found
//If no cafe provided display all
//If cafe not found empty array
//For this query I've decided to use cafe id as the query param as it suits the frontend request better
const employeeGetHandler: RequestHandler = async (req, res) => {
  const connection = await pool.getConnection();
  const cafeId = req.query.cafe;
  console.log(cafeId);
  if (cafeId) {
    try {
      const selectQuery = `SELECT e.id, e.name, e.email_address, e.phone_number, e.gender, DATEDIFF(e.start_date, NOW()) AS days_worked, c.name as cafe_name FROM employee e JOIN cafe c ON e.cafe_id = c.id WHERE c.id = ? ORDER BY days_worked DESC `;
      const [rows]: any = await connection.execute(selectQuery, [cafeId]);
      console.log(rows);
      return res.status(StatusCodes.OK).json({ employees: rows });
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.BAD_REQUEST).json({ message: error.code });
    } finally {
      connection.release();
    }
  } else {
    try {
      const selectQuery = `SELECT e.id, e.name, e.email_address, e.phone_number, e.gender, DATEDIFF(e.start_date, NOW()) AS days_worked, c.name as cafe_name FROM employee e LEFT JOIN cafe c ON e.cafe_id = c.id ORDER BY days_worked DESC `;
      const [rows]: any = await connection.execute(selectQuery);
      return res.status(StatusCodes.OK).json({ employees: rows });
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.BAD_REQUEST).json({ message: error.code });
    } finally {
      connection.release();
    }
  }
};

const getSingleEmployeeHandler: RequestHandler = async (req, res) => {
  const connection = await pool.getConnection();
  const employeeId = req.params.id;
  if (employeeId) {
    try {
      const selectQuery = `SELECT e.id, e.name, e.email_address, e.phone_number, e.gender, DATEDIFF(e.start_date, NOW()) AS days_worked, c.name as cafe_name, e.cafe_id FROM employee e LEFT JOIN cafe c ON e.cafe_id = c.id WHERE e.id = ? `;
      const [rows]: any = await connection.execute(selectQuery, [employeeId]);
      console.log(rows);
      return res.status(StatusCodes.OK).json({ employees: rows });
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.BAD_REQUEST).json({ message: error.code });
    } finally {
      connection.release();
    }
  }
};

//Create employee entry
const employeePostHandler: RequestHandler = async (req, res) => {
  console.log(req.body);
  // const { error } = employeeSchema.validate(req.body);

  // if (error) {
  //   return res
  //     .status(StatusCodes.BAD_REQUEST)
  //     .json({ error: error.details[0].message });
  // }
  const connection = await pool.getConnection();
  try {
    const UUID = generateUUID();
    const currentDate = new Date();
    const insertQuery = `INSERT INTO employee (id, name, email_address, phone_number, gender, cafe_id, start_date) VALUES(?, ?, ?, ?, ?, ?, ?)`;
    const body = [
      UUID,
      req.body.name,
      req.body.email_address,
      parseInt(req.body.phone_number),
      req.body.gender,
      req.body.cafe_id ? req.body.cafe_id : null,
      currentDate,
    ];
    const [result]: any = await connection.execute(insertQuery, body);

    if (result.affectedRows > 0) {
      return res.status(StatusCodes.OK).send("Employee added successfully.");
    } else {
      throw new Error("Database error");
    }
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.code });
  } finally {
    connection.release();
  }
};

//Update an employee details
const employeePutHandler: RequestHandler = async (req, res) => {
  console.log(req.body);
  // const { error } = employeeSchema.validate(req.body);

  // if (error) {
  //   return res
  //     .status(StatusCodes.BAD_REQUEST)
  //     .json({ error: error.details[0].message });
  // }
  const connection = await pool.getConnection();
  try {
    const employeeId = req.params.id;
    const updatedData = req.body;
    //get employee data
    const [rows]: any = await connection.execute(
      "SELECT * FROM employee WHERE id = ?",
      [employeeId]
    );
    if (rows.length === 0) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Employee not found" });
      return;
    }
    const employeeData = rows[0];
    //If employee has changed cafe reset start date
    if (employeeData.cafe_id !== updatedData.cafe_id) {
      employeeData.start_date = new Date();
    }
    //Update employee data
    const mergedData = { ...employeeData, ...updatedData };

    const updateQuery = `UPDATE employee SET name = ?, email_address = ?,phone_number = ?, gender = ?, cafe_id = ?, start_date = ? WHERE id = ?`;
    console.log(employeeData);
    console.log(updatedData);
    const [update]: any = await connection.execute(updateQuery, [
      mergedData.name,
      mergedData.email_address,
      parseInt(mergedData.phone_number),
      mergedData.gender,
      mergedData.cafe_id,
      mergedData.start_date,
      employeeId,
    ]);

    if (update.affectedRows > 0) {
      res
        .status(StatusCodes.OK)
        .json({ message: "Employee data updated successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.code });
  } finally {
    connection.release();
  }
};

const employeeDeleteHandler: RequestHandler = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const employeeId = req.params.id;
    const deleteQuery = `DELETE FROM employee WHERE id = ?`;
    const [result]: any = await connection.execute(deleteQuery, [employeeId]);

    if (result.affectedRows > 0) {
      res.status(StatusCodes.OK).json({ message: "employee deleted" });
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_GATEWAY).json({ message: error.code });
  } finally {
    connection.release();
  }
};

EmployeeController.get("/employee", employeeGetHandler);
EmployeeController.post("/employee", employeePostHandler);
EmployeeController.put("/employee/:id", employeePutHandler);
EmployeeController.delete("/employee/:id", employeeDeleteHandler);
EmployeeController.get("/employee/:id", getSingleEmployeeHandler);

export default EmployeeController;
