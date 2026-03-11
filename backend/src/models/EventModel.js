//Event Title,Short Description,Detailed Description,Date,
//Time,Location,Event Image URL,Event Speakers
//Speaker Name,,LinkedIn Profile,Speaker Image URL,Bio (Optional)
import mongoose from "mongoose";

const speakerSchema = new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    linkedIn_Profile:{
        type:String,
    },
    speaker_Image_Url:{
        type:String,
        required:true
    },
    bio:{
        type:String,
    }
})

const eventSchema =new mongoose.Schema(
    {
       title:{
        type:String,
        required:true
       },
       short_Description:{
        type:String,
        required:true
       },
       detailed_Description:{
        type:String,
        required:true
       },
       date:{
        type:Date,
        required:true
       },
       time:{
        type:Timestamp,
        required:true
       },
       event_Location:{
        type:String,
        required:ture
       },
       imgae_Url:{
         type:String,
       },
       speakers:{
        type:[speakerSchema]
       }

    },
    {timestamps:true}
);

export default mongoose.model("event",eventSchema);