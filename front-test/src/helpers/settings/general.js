import axios from "axios";

export const getGeneralData = async () => {
  try {
    const res = await axios.get("/admin/settings/general/get");

    return res.data.general;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateGeneralData = async (formData) => {
  try {
    const res = await axios.put("/admin/settings/general/update", formData);
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAdvancedData = async () => {
  try {
    const res = await axios.get("/admin/settings/advanced/get");
    return res.data.advanced;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateAdvancedSettings = async (values) => {
  try {
    const res = await axios.put("/admin/settings/advanced/update", values);
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getMaterielImageSection = async () => {
  try {
    const res = await axios.get("/admin/settings/homepage/get/materielimage");
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateMaterielImageSection = async (formData) => {
  try {
    const res = await axios.put(
      "/admin/settings/homepage/update/materielimage",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteMaterielImageSection = async () => {
  try {
    const res = await axios.delete(
      "/admin/settings/homepage/delete/materielimage"
    );
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
