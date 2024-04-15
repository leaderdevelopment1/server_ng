const express = require('express');
const router = express.Router();
const mysqlConnection = require('../connection/connection');
const jwt = require('jsonwebtoken');
const ID_ROL_ADMIN = 1;
const ID_ROL_ESTUDIANTE = 2;
const ID_ROL_DOCENTE = 3;

router.get('/',(req,res)=>{
    mysqlConnection.query("select * from usuarios", (err,rows,fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err)
        }
    })
});

router.post('/singin',(req,res)=>{
    const {userName,pass} = req.body;
    mysqlConnection.query("select * from usuarios where nombre=? and contrasena=?",
    [userName,pass],
    (err,rows,fields) => {
        if(!err){
            if(rows.length > 0){
                let data = JSON.stringify(rows[0]);
                const token = jwt.sign(data,'stil');
                res.json({token})
            }else{
                res.json('Usuario y constraseña incorrectos');
            }
        }else{
            console.log(err)
        }
    });
});

router.get('/docentes',(req,res)=>{
    mysqlConnection.query(`select * from usuarios where rol=?`,[ID_ROL_DOCENTE] ,(err,rows,fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err)
        }
    })
});

router.get('/administradores',(req,res)=>{
    mysqlConnection.query(`select * from usuarios where rol=?`,[ID_ROL_ADMIN] ,(err,rows,fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err)
        }
    })
});

router.get('/estudiantes',(req,res)=>{
    mysqlConnection.query(`select * from usuarios where rol=?`,[ID_ROL_ESTUDIANTE] ,(err,rows,fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err)
        }
    })
});

router.post('/test',verifyToken,(req,res) => {
    res.json('Informacion secreta');
});

function verifyToken(req,res,next){
   if(!req.headers.authorization) return res.status(401).json('No autorizado');

   const token = req.headers.authorization.substr(7);
   if(token !== ''){
    const content = jwt.verify(token,'stil');
    req.data = content;
    next();
   }else{
    res.status(401).json('Token vacio');
   }
}
module.exports = router;