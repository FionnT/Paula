# Paula - A Free Photograpy Site

A completely free, responsive Photograpy site allowed for general use under CC-BA 4.0

See below for attribution requirements.

To Setup
--

1/ First amend /server/models/schema/index.js  to point to your MongoDB instance, then start MongoDB  
2/ Next, insert your relevant data in the .env.example files in root, and /server, then rename them .env

2a/ For the mediaDir, I would recommend using the below

    Local: "__dirname, ../../../public" 
    Prod: "/var/www/media"

3/ Start the Server: 

    Local: cd server && npm install && npm start
    Prod: 
      1/ npm i forever -g && npm i nodemon -g 
      2/ cd server && npm install && npm run prod 

4/ Next install & start the front end: 

    Local: cd ../ && npm install && npm start
    Prod: npm run build

4a/ For production you should then serve it with a static server, such as nginx:

    sudo apt-get install nginx 
    nginx
    Update nginx.conf in root to match your configuration
    Rename "nginx.conf" in root to "default", and overwrite the file here: 
      /etc/nginx/sites-available


License
-- 
See here for more details as well: https://creativecommons.org/licenses/by/4.0/

You are free to:

1. Share — copy and redistribute the material in any medium or format
2. Adapt — remix, transform, and build upon the material

The licensor cannot revoke these freedoms as long as you follow the license terms.

Under the following terms:

1. Attribution — Attribution must be in the form of retaing the Copyright notice link in the bottom left of the page. The copyright notice page itself may be altered, but the license cannot be changed, must be displayed, and must contain a clearly visible link to this repository. You must also indicate if changes were made to any portion of this project. You may not suggest that I, the licensor endorses you or your use.
2. No additional restrictions — You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.

Notices:

You do not have to comply with the license for elements of the material in the public domain or where your use is permitted by an applicable exception or limitation.

No warranties are given. The license may not give you all of the permissions necessary for your intended use. For example, other rights such as publicity, privacy, or moral rights may limit how you use the material.
