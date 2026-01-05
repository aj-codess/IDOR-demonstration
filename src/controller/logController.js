import db from "./../config/db.js";
import auth_helper from "../services/auth_helper.js";

const login_or_signup = async (req,res) => {
    try{

        let AT;
        const {email,password} = req.body();

         if (!email || !password) {
            return res.status(400).json({ error: "Email and password required" });
        }

        const pool = db.getDB();

         const existingUser = await pool.query(
            `SELECT id, password FROM vulnerable_dms.users WHERE email = $1`,
            [email]
            );

        
        if (existingUser.rows.length > 0) {
      const user = existingUser.rows[0];

      //  Plaintext password check (intentional)
      if (user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Session / token mock
       AT= await auth_helper.signToken(user.id);

       res.setHeader("auth", `Bearer ${AT}`);

      return res.json({
        redirect:"/docs/dashboard",
        message: "Login successful",
        user_id: user.id
        });

    }



         // 3️⃣ User does not exist → create
    const newUser = await pool.query(
      `INSERT INTO vulnerable_dms.users (email, username, password)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [
        email,
        email.split("@")[0], // quick username derivation
        password
      ]
    );

    AT = await auth_helper.signToken(newUser.rows[0].id);
    res.setHeader("auth", `Bearer ${AT}`);

    return res.status(201).json({
      redirect :"/docs/dashboard",
      message: "User created",
      user_id: newUser.rows[0].id
    });

    } catch(error){
    console.error({
      system: "Error Logging out User",
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    res.redirect("/auth/login");

    return res.status(500).json({
      status: false,
      message: "Unable to Logout",
    });

    }
};


const logout = (req,res) => {
    try{

        req.session.destroy();
        res.redirect("/auth/login");

    } catch(error){

    console.error({
      system: "Error Logging out User",
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      status: false,
      message: "Unable to Logout",
    });
}
}


export default {
    login_or_signup,
    logout
}