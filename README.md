# Paula - A Free Photograpy Site

A completely free, responsive Photograpy site allowed for general use under CC-BA 4.0




To Setup
--

First amend models.js in server/models to point to your MongoDB instance, then start MongoDB

Start the Server: 

    cd server && npm install && npm start

Next install the front end: 

    cd ../ && npm install 

Followed by: 

    npm start (for dev)
    npm run build (for prod)

For production you may then serve it with a static server:

    npm i -g serve
    serve -s ./build -p 9000

Find out more about deployment here:

  bit.ly/CRA-deploy


License
-- 
See here for more details as well: https://creativecommons.org/licenses/by/4.0/

You are free to:

1. Share — copy and redistribute the material in any medium or format
2. Adapt — remix, transform, and build upon the material

The licensor cannot revoke these freedoms as long as you follow the license terms.

Under the following terms:

1. Attribution — Attribution must be in the form of retaing the Github link in the bottom right of the page, and you must indicate if changes were made. You may not suggest that I, the licensor endorses you or your use.
2. No additional restrictions — You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.

Notices:

You do not have to comply with the license for elements of the material in the public domain or where your use is permitted by an applicable exception or limitation.

No warranties are given. The license may not give you all of the permissions necessary for your intended use. For example, other rights such as publicity, privacy, or moral rights may limit how you use the material.
