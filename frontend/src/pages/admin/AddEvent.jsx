// frontend/src/pages/admin/AddEvent.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Calendar, Clock, MapPin, 
  ImageIcon, Users, Plus, Trash2, UploadCloud, 
  Camera, LayoutTemplate, AlignLeft, Sparkles, CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";
import { createEvent } from "../../api/adminApi"; 
import EventForm from "../../components/admin/EventForm";
const AddEvent = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleAddSubmit = async ({ formData, eventImages, speakers }) => {
    setIsSubmitting(true);
    const tId = toast.loading("Creating event...");
    try {
      const data = new FormData();
      // Append logic... (same as your original handleSubmit)
      await createEvent(data);
      toast.success("Published!", { id: tId });
      navigate("/admin");
    } catch (error) {
      toast.error("Failed", { id: tId });
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="p-8">
      <EventForm onSubmit={handleAddSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};

export default AddEvent;