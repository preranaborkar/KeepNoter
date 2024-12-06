const express =require("express");
const router=express.Router();
const userController=require('../controller/userController');
const { User } = require("../model/userModel");
// Middleware to check admin session
function checkUserSession(req, res, next) {
    if (!req.session.user) {
      return res.redirect('/');
    }
    next();
  }

router.get('/dashboard',checkUserSession,userController.getProfile);


router.get('/createNote',(req,res)=>{
    res.render('note/createNote');
})
router.post('/createNote',checkUserSession,userController.CreateNote);

router.get('/createList',(req,res)=>{
    res.render('list/createList');
})
router.post('/createList',checkUserSession,userController.createList);

router.get('/drawingPad',(req,res)=>{
    res.render('drawing/drawingPad');
});

router.get('/viewNotes',checkUserSession,userController.getNote);
router.post('/deleteNote/:id',checkUserSession,userController.deleteNote);

router.get('/updateNote/:id',userController.getNoteforupdate);
router.post('/updateNote/:id',checkUserSession,userController.updateNote);

router.get('/viewLists',checkUserSession,userController.getList);
router.get('/updateList/:id',checkUserSession,userController.getListforupdate);
router.post('/updateList/:id',checkUserSession,userController.updateList);
router.get('/deleteList/:id',checkUserSession,userController.deleteList);

module.exports = router;