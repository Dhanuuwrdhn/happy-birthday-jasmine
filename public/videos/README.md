Clip: our-memories.mp4 (portrait, shown inside the phone frame).

Keep it under 25 MB — that is Cloudflare's per-file limit for static assets.
To shrink a phone recording:

  ffmpeg -i input.mov -vf "scale=-2:1080" -c:v libx264 -crf 26 -preset slow -c:a aac -b:a 128k our-memories.mp4

A .mov straight from an iPhone should be remuxed, since Chrome and Android often
refuse the QuickTime container:

  ffmpeg -i input.mov -c copy -movflags +faststart our-memories.mp4
