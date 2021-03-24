# Paula - A Free Photograpy Site

A completely free, responsive Photograpy site allowed for general use under the MIT License

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
