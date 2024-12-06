const userModel = require('../model/userModel');
const dashboardModel=require('../model/dashboardModel');


const getProfile=async(req,res)=>{
    try{
        console.log('Session data:', req.session); // Debug log
    if (!req.session.user) {
      return res.redirect('/');
    }
    console.log("i am here");
    const email=req.session.user.email;
    const user=await userModel.User.findOne({email:email});

    console.log("getprofile user",user);

    res.render('dashboardfo/dashboard', { user });
    }catch(error){
        console.error('Error fetching profile:', error);
        return res.render('auth/login',{error:'User NOt exists '});
    }
}



const CreateNote=async (req,res)=>{
    const {title,content}=req.body;
    console.log("title :",title);
    console.log("content :",content);
    console.log(req.session.user);
    
    const userId=req.session.user.userId;

    const newNote=await dashboardModel.createNotes(userId,title,content);
    console.log("note ",newNote);
    res.redirect(`/dashboard`);
}


const createList=async (req,res)=>{
    const {title,list}=req.body;
    console.log("Title of list:",title);
    console.log("lists are:",list);
   
    const userId=req.session.user.userId;
  
    // Save the list items as an array
    const newList = new dashboardModel.List({
        userId,
        title,
        list, // Pass the list array directly
      });

      await newList.save();
    
      console.log("List created successfully:", newList);
    res.redirect(`/dashboard`);

}

const getNote=async (req,res)=>{
    console.log("enter in getnote");
    const userId=req.session.user.userId;
    const user= await userModel.User.findOne({_id:userId});
    console.log("user found in database",user);


    // Get all bookings
    const allNotes = await dashboardModel.Note.find({ userId }).populate('userId');
    console.log("got all notes :",allNotes)
    
    return res.render('note/viewNote',{notes:allNotes});
}

const getNoteforupdate=async (req,res)=>{
    console.log("enter in getnoteforupdate");
    
    const id=req.params.id;
    const note=await dashboardModel.Note.findOne({_id:id});
    return res.render('note/updateNote',{note});
}

const deleteNote=async (req,res)=>{
    const userId=req.session.user.userId;
    const noteId = req.params.id;
    
    console.log("notId",noteId);
    const note=await dashboardModel.Note.findOneAndDelete({_id:noteId,userId:userId});
    if (!note) {
        console.log('Note not found or user unauthorized to delete it');
        return res.status(404).send('Note not found');
      }
    
    console.log('Deleted note:', note);
    res.redirect('/viewNotes');
}

const updateNote=async (req,res)=>{
    try{
        const noteId = req.params.id;
    const {title , content}=req.body;
    await dashboardModel.Note.findByIdAndUpdate(noteId,{title,content});
    console.log("updated note sucessfully");
    res.redirect('/viewNotes');
    }catch(error){
        console.log("error in updateing the note ",error);
    }

}
const getList=async(req,res)=>{
    console.log("enter in getList");
    const userId=req.session.user.userId;
    const user= await userModel.User.findOne({_id:userId});
    console.log("user found in database",user);


    // Get all bookings
    const allLists = await dashboardModel.List.find({ userId }).populate('userId');
    console.log("got all lists :",allLists)
    
    return res.render('list/viewList',{lists:allLists});
}


const getListforupdate=async (req,res)=>{
    console.log("enter in getlistforupdate");
    
    const id=req.params.id;
    const list=await dashboardModel.List.findOne({_id:id});
    return res.render('list/updateList',{list});
}

const updateList=async (req,res)=>{
    try{
    const listId = req.params.id;
    const {title , list}=req.body;
    await dashboardModel.List.findByIdAndUpdate(listId,{title,list});
    console.log("updated lists sucessfully");
    res.redirect('/viewLists');
    }catch(error){
        console.log("error in updateing the note ",error);
    }

}

const deleteList=async (req,res)=>{
    const userId=req.session.user.userId;
    const listId = req.params.id;
    
   
    const list=await dashboardModel.List.findOneAndDelete({_id:listId,userId:userId});
    if (!list) {
        console.log('Note not found or user unauthorized to delete it');
        return res.status(404).send('Note not found');
      }
    
    console.log('Deleted list:', list);
    res.redirect('/viewLists');
}



module.exports={
    getProfile,
    CreateNote,
    createList,
    getNote,
    deleteNote,
    updateNote,
    getNoteforupdate,
    getListforupdate,
    getList,
    updateList,
    deleteList,
}