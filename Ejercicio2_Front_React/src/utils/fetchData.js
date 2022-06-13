import axios from "axios";
import { serialize } from 'object-to-formdata';
// const apiBaseUrl = process.env.REACT_APP_API_URL;

export const getDataAPI = async (url, token) => {
  const res = await axios.get(`/api/${url}`, {
    headers: {
      Authorization: token,
      // headers: { Authorization: `Bearer ${token}`
    },
  });
  return res;
};

export const postDataAPI = async (url, post, token) => {
  const res = await axios.post(`/api/${url}`, post, {
    headers: {
      Authorization: token,
      // headers: { Authorization: `Bearer ${token}`
    },
  });
  return res;
};

export const postFormDataAPI = async (url, post, token) => {

  console.log(post)
  let { test } = post
  // let blob;

  // for (const key in values) {
  //   if (values[key] instanceof File)
  //     blob = values[key];
  // }

  // // const formData = serialize(
  // //   post,
  // //   // options, // optional
  // //   // existingFormData, // optional
  // //   // keyPrefix, // optional
  // // );

  // console.log(blob)

  const formData = new FormData();
  formData.append('tets', test)
  // for (const key in post) {
  //   form.append(key, new Blob([JSON.stringify(post[key])], {
  //     type: "application/json"
  //   }))
  // }

  // for (const key in post) {
  //   formData.append(key, post[key])
  // }

  return;

  const res = await fetch(`/api/${url}`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: token,
      // 'Content-Type': 'multipart/form-data',
      // headers: { Authorization: `Bearer ${token}`
    },
  });

  return res;
};

export const putDataAPI = async (url, post, token) => {
  const res = await axios.put(`/api/${url}`, post, {
    headers: {
      Authorization: token,
      // headers: { Authorization: `Bearer ${token}`
    },
  });
  return res;
};

export const patchDataAPI = async (url, post, token) => {
  const res = await axios.patch(`/api/${url}`, post, {
    headers: {
      Authorization: token,
      // headers: { Authorization: `Bearer ${token}`
    },
  });
  return res;
};

export const deleteDataAPI = async (url, token) => {
  const res = await axios.delete(`/api/${url}`, {
    headers: {
      Authorization: token,
      // headers: { Authorization: `Bearer ${token}`
    },
  });
  return res;
};
