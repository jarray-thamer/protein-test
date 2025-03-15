import {
  deleteClients,
  sendEmail,
  sendSMS,
} from "@/helpers/clients/communication";

export const handleDeleteClients = async (clientsArray, refresh) => {
  const clientsIds = clientsArray.map((client) => client.original._id);
  try {
    const res = await deleteClients(clientsIds);
    if (refresh) {
      refresh();
    }
    return res;
  } catch (error) {
    console.error("Error in handleDeleteClients:", error);
    throw error;
  }
};

export const handleSendSMS = async (selectedRows, message) => {
  const clientsNumbers = selectedRows.map((client) =>
    client.original.phone1 ? "216" + client.original.phone1 : ""
  );
  try {
    const res = await sendSMS(clientsNumbers, message);
  } catch (error) {
    console.error("Error in handleSendSMS:", error);
    throw error;
  }
};

export const handleSendEmail = async (selectedRows, message, subject) => {
  const clientsEmails = selectedRows.map((client) =>
    client.original.email ? client.original.email : ""
  );
  try {
    const res = await sendEmail(clientsEmails, subject, message);
  } catch (error) {
    console.error("Error in handleSendEmail:", error);
    throw error;
  }
};
