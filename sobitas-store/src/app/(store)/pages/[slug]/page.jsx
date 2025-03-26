"use client";

import axiosInstance from "@/lib/axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const PagesDetails = () => {
  const { slug } = useParams();
  const [data, setData] = useState();
  useEffect(() => {
    const fetchPageBySlug = async () => {
      const res = await axiosInstance.get(`/pages/get/by-slug/${slug}`);

      setData(res.data.data);
    };
    fetchPageBySlug();
  }, []);
  return (
    <div className="flex flex-col w-full mx-auto space-y-12 my-44 max-w-screen-2xl">
      <h3 className="text-5xl font-medium">{data?.title}</h3>
      <div
        className="w-full space-y-20 prose max-w-screen-2xl"
        dangerouslySetInnerHTML={{ __html: data?.content }}
      />
    </div>
  );
};

export default PagesDetails;
