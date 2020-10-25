## Inspiration

Has this ever happened with you that your hands are dirty and you don't want touch your laptop to perform an action. May be you are having dinner and reading an article on your computer. Or you watching a video on youtube or netflix and suddenly an ad or intro shows up that you want to skip. I faced these problems almost everyday and so in this hackathon I have made this chrome extension that allows you to use gestures to control webpages. Additionally, during these times of pandemic we could use this product at our printing centers to make them entirely touchless as our printers only requires 3-4 actual actions.

## What it does

It controls webpages using gestures. Here is a brief description:
1. Youtube: Up - Scroll up, Down - Scroll Down, Left - Pause Video, Right - Skip Ad
2. Netflix: Up - Scroll up, Down - Scroll Down, Left - Pause Video, Right - Skip Intro
3. Twitch: Up - Scroll up, Down - Scroll Down, Left - Pause Stream, Right - Skip Intro
4. Other Websites: Up - Scroll up, Down - Scroll Down, Left - Zoom In, Right - Zoom Out

## How I built it

This application is built using javascript, gest.js and chrome extension developer tools.

## Challenges I ran into

The major challenge was to find a robust way to do gesture recognition in realtime in web browser without using a network call. As we are using webcam we don't want to send the video of a person to a server. I started with tensorflow.js but it turned out to be extremely slow for realtime. Finally I landed up on this js library called gest.js which uses just the contour of handcolor to detect motion of hand. Using it and javascript I built this application.

## Accomplishments that I'm proud of

Finally getting it working so smoothly. 

## What's next for TouchFree

Creating a UI for the popup of chrome extension to allow user to configure the gesture actions individually for every website.