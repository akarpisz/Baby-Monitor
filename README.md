# Baby-Monitor
A basic baby monitor pp for the Raspberry Pi using NodeJS

So...you’ve got a baby. Surely you have a baby monitor. What if there was a way to make your own, with wifi connectivity on your local network? What if you want more cameras, or to design or configure your own application for it?

Typical wifi baby monitors have security flaws, and aren’t very configurable. I’m a paranoid person, and wanted full control over the application’s behavior and function. Using only Motion, i found it difficult to turn off the device or reboot (had to ssh into the pi everytime i wanted to turn it off) The raspberry pi 4 was perfect for this, so this is what i used and how i got it working:

This is where the code is:
https://github.com/akarpisz/Baby-Monitor

Here’s the setup to  make it fully functional.
*This assumes you have set up your Raspberry Pi with Raspian (now called Raspberry Pi OS) and it’s working, with ssh and camera module enabled in raspi-config. If not, there are plenty of excellent materials to be found on Google!*

Table of Contents:
Static ip address on local network
Setup camera
Setup motion and motion.conf
Start server after cloning repo
Make it Better - Nginx (optional)
Later features and additions



-Static IP
Your network may always assign the same ip to the Raspberry Pi, but to ensure this, edit your /etc/dhcpcd.conf file and set a static ip address for the device. Something along the lines of this should work:

interface wlan0 (or eth0 if that’s what you’re using)
static ip_address=10.0.0.13/24 //local ip address, and cyder notation indicating subnet mask
static routers=10.0.0.1 //router ip address, usually the x.x.x.1 address
static domain_name_servers=10.0.0.1 8.8.8.8 //the router, and a backup DNS address

Google more information if needed. You can set ipv6 addresses and more. This is just what I used to make the application stable

-Setting up the camera
This program uses the “motion” program, and will work with a USB camera or the RPi Camera Module. For a USB camera, it must be able to utilize h264, and video4linux. A nice cheap option to play around with is the Playstation Eye, for 10-15 dollars.

If using the official camera module, run “sudo modprobe bcm-2835-v4l2” (this can be set to run when the pi boots (rc.local, etc), otherwise you must run this command every time you turn the Pi on). If you  get an error, check that the pi is recognizing it with “vcgencmd get_camera” (try running with “sudo”, and/or with full path /usr/bin/vcgencmd). You may have to adjust the connector, or update your Raspian version (previously, i had to reflash the SD card, as some piece of software  was missing, and i could find or install it with any of the typical update commands, including rpi-update)..

-Setup Motion

Run “sudo apt install motion”.
Next, edit the config file located at /etc/motion/, you’re looking for motion.conf. 
The most important areas that must be changed for this to work are:

# Start in daemon (background) mode and release terminal (default: off)
daemon on

# Image width (pixels). Valid range: Camera dependent, default: 320
width 320

# Image height (pixels). Valid range: Camera dependent, default: 240
height 240

# Maximum number of frames to be captured per second.
# Valid range: 2-100. Default: 100 (almost no limit).
framerate 30
(depends on your camera)

# Restrict stream connections to localhost only (default: on)
stream_localhost off



I left the port setting at the default 8081. If you just want to be able to see the video on your local network without additional functionality, or to test it to ensure motion is working and broadcasting video, visit “http://*ip-address-of-the-pi*:8081 . If you change the default port, remember to change the URL in the public/index.html file.

NodeJS

Once you’ve configured motion and it works (Yay!), ensure you have nodejs on the pi. Type “node -v” and hit enter. Raspian has NodeJS installed by default, although in my experience it is a couple versions behind. I installed version 14.5.0 before coding all of this, but if you get errors in Node, that *may* be it (although there is no advanced functionality used).

-Start server after cloning repo

Git clone the repo: https://github.com/akarpisz/Baby-Monitor
I put in on my desktop for easy access.

Test that the server works with “node index.js” while in the root repo folder. After that, visit the pi ip address on port 5000 (you can change the app’s port if needed in index.js).


You should now be able to see the video from motion, and the off button should run a bash command shutting down the device. Reboot should reboot the device.



--Make it even better

You can run the node server automatically when the pi boots up with crontab
Add this line to cron:
@reboot /usr/local/bin/forever start -c /path/to/node /your/path/to/your/app.js
It may need some adjustment based on your system. You can also use rc.local or a program like pm2.


Personally, I wanted to input the ip address and get the application, so i installed and configured nginx as a reverse proxy, automatically redirecting me to the app’s port.

Nginx configuration could fill books upon books, but my configuration is basic. “Sudo apt install nginx”, the go to /etc/nginx/sites-available. I created a new file based on the default (sudo mv default whateveryounameit) and this is what it looks like: 

*be sure to change the local ip address to the static ip you’ve set, and change the “root” to wherever you cloned the repo to*
server {
        listen 80;
        listen [::]:80;
        server_name 10.0.0.13;

        root /home/pi/Desktop/Code/Node/Baby-Mon/;

        
        server_name 10.0.0.13;

        location / {
                autoindex on;
autoindex_exact_size off;
                proxy_pass http://localhost:5000;
                }
}

After creating that file, be sure to copy it to the “sites-enabled” folder in /etc/nginx/. Restart the nginx service, and, while the node index.js server is running, visit the local ip address on another browser. If you see the application, it’s finished!

Let me know of any issues or bugs, and if you’ve got a feature to add, let me know! (andrew.karpisz@gmail.com)

This app was developed because of my desire for a fully configurable baby monitor. The UI is basic, customize to your liking.


--coming up
(Not finished yet but repo is created on my github) there are python scripts to add, with  functionality like SMS alerts, alerting you of your child moving. And I’m working on an OpenCV script that will alert you via SMS if your child’s eyes are open. Check back if interested!













