import express from 'express';
import Applicant from '../models/ApplicantModel.js';

export const ApplicationControler=async (req,res)=>{
   try{
    const newApplication=new Applicant(req.body);
    const savedAppliacnt=await newApplication.save()

    res.status(201).json(savedAppliacnt);
   }catch(error){
    res .status(500).json({message:"Error in creation a application", error:error.message});
   }
};

