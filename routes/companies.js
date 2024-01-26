const express = require("express")
const router = express.Router()
const db = require("../db");




/** Shows all companies */

router.get("/", async (req, res, next) => {
    try{
    const results = await db.query('SELECT * FROM companies');
    return res.json(results.rows);
    }

    catch(err){
        return next(err);
    }
  })





/** Shows companies that have this code */

router.get("/:code", async (req, res, next) => {
    try{
        const { code } = req.params;
        const results = await db.query('SELECT * FROM companies WHERE code = $1', [code])

        if(results.rows.length === 0) {
            throw res.status(404).json(`${ code } is not a company code`)
        }
        else {
        return res.json({companies: results.rows[0]});
        }

    }   catch(err){
        return next(err);
        }

});


/** Allows users to post new companies */

router.post("/", async (req, res, next) => {
    
    try{
        const { code, name, description } = req.body;
        if (code.length === 0){
            throw res.json(`Code cannot be blank`)
        } else{
        const results = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *', [code, name, description]);
        return res.status(201).json(results.rows[0])
        }}
    
    catch(err){
        return next(err);
    }
    
});


/** Allows users to update information of an existing company */

router.put("/:code", async (req, res, next) => {

    try{
        const{ code } = req.params;

        const check = await db.query('SELECT * FROM companies WHERE code = $1', [code])

        if(check.rows.length === 0) {
            throw res.status(404).json(`${ code } is not a company code`)
        }else{

        const { name, description } = req.body;

        
        const results = await db.query('UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING *', [name, description, code])
        return res.json(results.rows)}
    }catch(err){
        return next(err);

    }


})

/** Allows users to delete an existing company */

router.delete("/:code", async (req, res, next) => {

    try{
        const{ code } = req.params;
        const check = await db.query('SELECT * FROM companies WHERE code = $1', [code])

        if(check.rows.length === 0) {
            throw res.status(404).json(`${ code } is not a company code`)
        }

        else{

        await db.query('DELETE FROM companies WHERE code=$1 RETURNING *', [code])
        return res.send({msg: "Company Deleted"})}
    }catch(err){
        return next(err);

    }
})
        


module.exports = router;




