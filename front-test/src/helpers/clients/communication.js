import axios from "axios";
import { toast } from "sonner";

export const getAllClients = async () => {
  try {
    const response = await axios.get("/admin/clients/get/all");

    return response.data;
  } catch (error) {
    throw new Error(error?.res?.data?.message || "Failed to get all Clients");
  }
};

export const deleteClients = async (clientsIds) => {
  try {
    const res = await axios.post("/admin/clients/delete/many", clientsIds);

    toast.success("Clients deleted successfully");
    return res.data;
  } catch (error) {
    toast.error("Failed to delete clients");
    throw new Error(error.res?.data?.message || "Failed to delete clients");
  }
};

export const createClient = async (formData) => {
  try {
    const res = await axios.post("/admin/clients/new", formData);
    toast.success("Client created successfully");
    return res.data;
  } catch (error) {
    toast.error("Failed to create client");
    throw new Error(error.res?.data?.message || "Failed to create client");
  }
};

export const getClientById = async (clientId) => {
  try {
    const res = await axios.get(`/admin/clients/get/by-id/${clientId}`);

    return res.data;
  } catch (error) {
    throw new Error(error.res?.data?.message || "Failed to fetch client");
  }
};

export const updateClient = async (clientId, formData) => {
  try {
    const res = await axios.put(`/admin/clients/update/${clientId}`, formData);
    toast.success("Client updated successfully");
    return res.data;
  } catch (error) {
    toast.error("Failed to update client");
    throw new Error(error.res?.data?.message || "Failed to update client");
  }
};

export const sendSMS = async (clientsPhone, message) => {
  try {
    const res = await axios.post("/admin/clients/send-sms", {
      clientsPhone,
      message,
    });
    toast.success("SMS sent successfully");
  } catch (error) {
    toast.error("Failed to send SMS");
    throw new Error(error.res?.data?.message || "Failed to send SMS");
  }
};

export const sendEmail = async (clientsEmail, subject, message) => {
  try {
    const res = await axios.post("/admin/clients/send-email", {
      clientsEmail,
      subject,
      message,
    });
    toast.success("Email sent successfully");
  } catch (error) {
    toast.error("Failed to send email");
    throw new Error(error.res?.data?.message || "Failed to send email");
  }
};
