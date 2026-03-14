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
    const tId = toast.loading("Deploying event...");

    try {
      const data = new FormData();
      
      // 1. Append basic text fields (Title, Date, etc.)
      Object.keys(formData).forEach(key => {
        if (formData[key] !== undefined && formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });
      
      // 2. Append Event Gallery Images
      if (eventImages && eventImages.length > 0) {
        eventImages.forEach(file => data.append("eventImages", file));
      }

      // 3. Format Speakers JSON (Backend explicitly checks for req.body.speakers)
      // Even if the speakers array is empty, we MUST send a stringified array.
      const speakerJson = speakers.map(s => ({ 
        name: s.name, 
        linkedIn_Profile: s.linkedIn_Profile, 
        bio: s.bio 
      }));
      data.append("speakers", JSON.stringify(speakerJson));

      // 4. Append Speaker Images in the EXACT order
      let missingImages = false;
      if (speakers.length > 0) {
        speakers.forEach((s) => {
          if (s.imageFile) {
            data.append("speakerImages", s.imageFile);
          } else {
            missingImages = true;
          }
        });
      }

      // 5. Frontend Validation (Matches Backend Requirement)
      if (speakers.length > 0 && missingImages) {
        toast.error("Profile images are required for all speakers.", { id: tId });
        setIsSubmitting(false); 
        return;
      }

      // 6. Send to API
      await createEvent(data);
      toast.success("Event successfully published!", { id: tId });
      setTimeout(() => navigate("/admin/events"), 1000); // Fixed navigation path

    } catch (error) {
      console.error("Backend Error:", error);
      // This will show exactly WHAT the backend complained about
      const errorMsg = error.response?.data?.message || "Failed to deploy event.";
      toast.error(errorMsg, { id: tId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <EventForm onSubmit={handleAddSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};

export default AddEvent;