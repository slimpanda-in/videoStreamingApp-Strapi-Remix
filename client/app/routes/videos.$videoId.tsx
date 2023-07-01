import { LoaderArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({params} : LoaderArgs) {
    console.log(params.videoId);
    const videoResponse = await fetch("http://127.0.0.1:1337/api/videos/" + params.videoId + "?populate=*");
    const videoResponseStream = await fetch(
        "http://127.0.0.1:1337/api/videos/play" + params.videoId
        );
    const videoResponseData = await videoResponse.json();
    const videoResponseStreamData = await videoResponseStream.json();
    return json({
        data: videoResponseData.data,
        stream: videoResponseStreamData,
    });
}

interface PostResponse {
    data: {
        id: string;
        attributes: {
            vidTitle: string;
            vidDesc: string;
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
            video: {
                data: {
                    id: string;
                    attributes: {
                        name: string;
                        url: string;
                    };
                }
            }
        };
    };
    meta: any;
    stream: any;
}

export default function VideoDynamicRoute() {
    const {data, stream} = useLoaderData() as PostResponse;
    console.log(data, stream);
    return <div>
        <h1>{data.attributes.vidTitle}</h1>
        <p>{data.attributes.vidDesc}</p>
        <video controls src={"http://127.0.0.1:1337"+ data.attributes.video.data.attributes.url}></video>
    </div>
}