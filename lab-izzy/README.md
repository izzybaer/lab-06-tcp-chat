# TCP-CHAT
\n
# In todays TCP Chat project I created a TCP server using the net module. I then created a client constructor which was instantiated when sockets connected to the server. In the Client constructor I created a property to give the client a unique 'nickname'. Once sockets connected with clientPool they were given event listeners for data, error, and close events.
\n
# To get the project running you must include const net = require('net'), and const server = net.createServer(). Server.listen is necessary to listen for a port so we can run live in the terminal by running the command 'telnet localhost (port number)', in another terminal window run node index.js. Both of these must be running consecutively for everything to function properly.
\n
# To connect to the server we create a file index.js, require our net and net.createServer, and then we use server.on('connection', (socket) => { let client = new Client(socket); socket.write(`hello ${client.nickName}, welcome to codeChat!\n`);console.log(`${client.nickName} is connected!`). Then you are connected!
