'use strict';
const fs = require('fs');
const path = require('path');

/**
 * video controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::video.video', ({ strapi }) => ({
    async play(ctx) {
        // Find the video entity with the provided ID and populate the video field
        const { video } = await strapi.entityService.findOne("api::video.video", ctx.request.params.id, {
            populate: {
                video: true
            },
        })
        console.log(video, "######### video #########")

        // Define the path to the video file
        const MY_PATH = strapi.dirs.static.public;
        const VIDEO_PATH = path.join(MY_PATH, video.url);

        // Get the size of the video file
        const videoStats = fs.statSync(VIDEO_PATH);
        const videoSize = videoStats.size;

        // Get the range of bytes requested by the client
        const videoRange = ctx.request.headers.range;

        // Check if the file exists
        try {
            fs.promises.access(VIDEO_PATH, fs.constants.F_OK);
            console.log('The file exists');
        } catch (err) {
            console.error(err);
            ctx.throw(404, 'File not found');
        }

        // Set the response headers for the video file
        ctx.set('Content-Type', 'video/mp4');
        ctx.set('Content-Ranges', 'bytes');

        // If a range of bytes is requested, stream the partial content
        if (videoRange) {
            const parts = videoRange.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
            const chunksize = (end - start) + 1;

            // Set the response headers for the partial content
            ctx.set('Content-Type', 'video/mp4');
            ctx.set('Content-Ranges', `bytes ${start}-${end}/${videoSize}`);

            // Stream the partial content of the video file
            ctx.body = fs.createReadStream(VIDEO_PATH, { start, end });
        } else {
            // Set the response headers for the full video content
            ctx.status = 200;
            ctx.set('Content-Length', videoSize);

            // Stream the full content of the video file
            ctx.body = fs.createReadStream(VIDEO_PATH);
        }
    }
}));