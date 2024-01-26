const express = require("express")
const router = express.Router()
const db = require("../db");




/** Shows all invoices */

router.get("/", async (req, res, next) => {
    try{
    const results = await db.query('SELECT * FROM invoices');
    return res.json(results.rows);
    }

    catch(err){
        return next(err);
    }
  })





/** Shows invoices that have this id */

router.get("/:id", async (req, res, next) => {
    try{
        const { id } = req.params;
        const results = await db.query('SELECT * FROM invoices WHERE id = $1', [id])

        if(results.rows.length === 0) {
            throw res.status(404).json(`${ id } is not a valid id`)
        }
        else {

        const code = results.rows[0].comp_code
        const company = await db.query('SELECT * FROM companies WHERE code = $1', [code])
        return res.json({invoice: results.rows[0], company: company.rows[0]});
        }

    }   catch(err){
        return next(err);
        }

});


/** Allows users to create new invoices */

router.post("/", async (req, res, next) => {
    
    try{
        const { comp_code } = req.body;
        const { amt } = req.body;

         const paid = false;
         const paid_date = null;
         const add_date = new Date();
         add_date.toLocaleDateString();

        const check_comp = await db.query('SELECT * FROM companies WHERE code = $1', [comp_code])

        if(check_comp.rows.length === 0) {
            throw res.status(404).json(`${comp_code} is not a company code`)
        }

        const results = await db.query('INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date) VALUES ($1, $2, $3, $4, $5) RETURNING *', [comp_code, amt, paid, add_date, paid_date]);
         return res.status(201).json({invoice: results.rows[0]})
         }
    
    catch(err){
        return next(err);
    }
    
});


/** Allows users to update information of an existing invoice */

router.put("/:id", async (req, res, next) => {

    try{
        const{ id } = req.params;

        const check = await db.query('SELECT * FROM invoices WHERE id = $1', [id])

        if(check.rows.length === 0) {
            throw res.status(404).json(`${ id } is not a valid id`)
        }else{

        const { amt } = req.body;

        const results = await db.query('UPDATE invoices SET amt=$1 RETURNING *', [amt])
        return res.json(results.rows)}
    }catch(err){
        return next(err);

    }


})

/** Allows users to delete an existing company */

router.delete("/:id", async (req, res, next) => {

    try{
        const{ id } = req.params;
        const check = await db.query('SELECT * FROM invoices WHERE id = $1', [id])

        if(check.rows.length === 0) {
            throw res.status(404).json(`${ id } is not a valid invoice id`)
        }

        else{

        await db.query('DELETE FROM invoices WHERE id=$1 RETURNING *', [id])
        return res.send({msg: "Invoice Deleted"})}
    }catch(err){
        return next(err);

    }
})
        


module.exports = router;
