import { json, type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Link } from "@remix-run/react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader() {
  const response = await fetch("http://127.0.0.1:1337/api/videos");
  const data = await response.json();
  return json({...data});
}

interface PostResponse {
  id: string;
  attributes: {
    vidTitle: string
    vidDesc: string
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

export default function VideosRoute() {
  const {data, meta } = useLoaderData();
  console.log(data, meta);
  return (
    <div>
      {data.map((post: PostResponse) => {
        return (
          <div key={post.id}>
            <h1>{post.attributes.vidTitle}</h1>
            <p>{post.attributes.vidDesc}</p>
            <Link to={`/videos/${post.id}`}>Watch The Video Here!</Link>
          </div>
        )
      })}
    </div>
  );
}