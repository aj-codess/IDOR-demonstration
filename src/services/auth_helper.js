import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as crypto from "crypto";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

  const PUBLIC_KEY_PATH = path.join("./assets/keys","public.pem");
  const PRIVATE_KEY_PATH = path.join("./assets/keys","private.pem");

  const writePublicPrivate=async()=>{
    try{

      // Ensure directory exists
    if (!fs.existsSync("./assets/keys")) {
      fs.mkdirSync("./assets/keys", { recursive: true });
    }

    // If both keys already exist, DO NOTHING
    if (fs.existsSync(PUBLIC_KEY_PATH) && fs.existsSync(PRIVATE_KEY_PATH)) {
      console.log(" RSA keys already exist. Skipping generation.");
      return;
    }

    console.log(" Generating RSA key pair...");

    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    fs.writeFileSync(PUBLIC_KEY_PATH, publicKey, { mode: 0o644 });
    fs.writeFileSync(PRIVATE_KEY_PATH, privateKey, { mode: 0o600 });

    console.log("RSA keys Generated....");

    } catch(error){
      console.log("Error Writing private and public key to File - ",error);
      process.exit(1);
    }
  };


  let publicKey;
  let privateKey;

  const loadKeyToMemory=async()=>{
    try{
      privateKey = fs.readFileSync('./assets/keys/private.pem', 'utf8');
      publicKey = fs.readFileSync('./assets/keys/public.pem', 'utf8');
    } catch(error){
      console.log("Error Loading Persistent Key to Memory - ",error);
      process.exit(1);
    }
  };
  


  const signToken = async (id) => {

    return new Promise((resolve, reject) => {
      jwt.sign(
        { id: id},
        privateKey,
        {
        algorithm: 'RS256'
      },
        (err, token) => {
          if (err) {
            reject(err);
          } else {
            resolve(token);
          }
        }
      );
    });

  };



 const signRT = async (id, session) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { id: id, session:session },
      privateKey,
      {
        algorithm: 'RS256',
        expiresIn: '7d',
      },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};



const verifyToken = async (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        publicKey,
        { algorithms: ['RS256']},
        (err, decoded) => {
          if (err) {
            reject(err);
          } else {
            resolve(decoded);
          }
        }
      );
    });
  };


  export default {
    verifyToken,
    signToken,
    signRT,
    writePublicPrivate,
    loadKeyToMemory
  }