import { API_URL } from "@/lib/config/environment";
import { GetServerSideProps } from "next";
import React from "react";

const SlugPage = () => {
  return <div></div>;
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  res,
}) => {
  const { slug } = params as any;
  const linkUrl = API_URL + "/links";

  try {
    console.log("Called!");
    const response = await fetch(`${linkUrl}${slug}`, { method: "GET" });
    if (!response.ok) {
      return {
        notFound: true,
      };
    }
    const data = await response.json();
    console.log("data", JSON.stringify(data));
    res.writeHead(302, { Location: data });
    return { props: {} };
  } catch (error) {
    console.log(JSON.stringify(error));
    return {
      notFound: true,
    };
  }
};

export default SlugPage;
