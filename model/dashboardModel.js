const mongoose=require('mongoose');

const noteSchema= new mongoose.Schema(
   {
    userId: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,
     },

    title: {
        type:String,
        required:true,
    },
    content: {
        type:String,
        required:true,
    },
    
   },
   {
    timestamps: true,
   }

);




const Note=mongoose.model('Note',noteSchema);



const listSchema=new mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,
         },
        title:{
            type:String,
            required:true,
        },
        list:[
            {
                type:String,
                required:true,
            }
        ]
    },
    {
        timestamps:true,
    }
);

const createNotes=async (userId,title,content)=>{
    const newNote=new Note(
       {
        userId,
        title,
        content
       } 
    );
    try{
        await newNote.save();
        console.log("Note created sucessfully");
        return newNote;

    }catch(error){
        throw new Error('Error saving user: ' + error.message);
    }
}
const List=mongoose.model('List',listSchema);


module.exports={
    Note,
    List,
    createNotes,
   
   
}