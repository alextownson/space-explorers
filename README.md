# Space Explorers

![Triangle spaceship flying through a spiral maze with a glowing blue planet at the end.](/assets/readme/2019-spaceExplorers.gif)

[Space Explorers](https://alextownson.github.io/space-explorers/) is one of the first web projects I ever designed and developed. It is a maze game inspired by one of my favourite arcade games, Asteroids. 

## Design and Development v1.0 (2019)

When I started this project, I had only learned the bare minimum HTML and CSS to get going with JavaScript. I did not properly plan and design the game to work on various devices or screen sizes. The game originally only worked on devices that have a larger screen size with a mouse and keyboard. 

## Space Explorers v2.0 (2023)

[![Space Explorers being played on mobile](/assets/readme/space-explorers-demo.jpg)](https://vimeo.com/803889493)

In order to make Space Explorers work on mobile, I needed to make my design responsive and solve how the game controls would translate to a device without a mouse and keyboard. 

### Device Motion

Using the skills I learned in my other project, [Black Box](https://github.com/alextownson/black-box), I was able to add a device motion event listener. On IOS devices this also requires requesting permission for that event data, which I did using conditionals and promises. I used the data from the X axis to control the rotation of the spaceship. Then I added event listeners for touch start and end to control the acceleration of the spaceship.

### Secure Local Development Server 

One challenge I ran into while working with the motion event listener is that I needed a secure local development server. Using [mkcert](https://github.com/FiloSottile/mkcert) I was able to create locally-trusted development certificates. This allowed me to access the sensors and their data on mobile while I was developing. 

### Responsive Design 

Another barrier to mobile use was the shape of the canvas. In the original design, the canvas is landscape which as a browser resizes or on a portrait oriented device, does not work. I used a combination of load and resize event listeners to re-render the canvas if the width of the viewport was smaller than the original canvas width. This required changing the shape of the wormhole too. A simple resize would not have worked for the wormhole because it is a line drawing.