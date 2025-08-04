import { RequestHandler } from "express";
import { ContactRequest, ContactSubmission } from "@shared/api";

// Mock storage for contact submissions - in a real app, this would be stored in a database
const contactSubmissions: ContactSubmission[] = [];

export const handleContactSubmission: RequestHandler = (req, res) => {
  try {
    const { name, email, phone, message }: ContactRequest = req.body;
    
    // Validate required fields
    if (!name || !message) {
      return res.status(400).json({ 
        error: "Name and message are required fields" 
      });
    }
    
    // Create new contact submission
    const newSubmission: ContactSubmission = {
      id: Date.now().toString(), // Simple ID generation - use UUID in production
      name,
      email,
      phone,
      message,
      createdAt: new Date().toISOString()
    };
    
    // Store the submission (in a real app, save to database)
    contactSubmissions.push(newSubmission);
    
    console.log("New contact submission received:", newSubmission);
    
    res.status(201).json({ 
      message: "Contact form submitted successfully",
      id: newSubmission.id
    });
  } catch (error) {
    console.error("Error processing contact submission:", error);
    res.status(500).json({ error: "Failed to submit contact form" });
  }
};

export const handleGetContactSubmissions: RequestHandler = (req, res) => {
  try {
    // This would typically require admin authentication
    res.status(200).json({ submissions: contactSubmissions });
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    res.status(500).json({ error: "Failed to fetch contact submissions" });
  }
};
