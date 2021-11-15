# Fastech-Node
 Fastech's translation from PHP into Node, with the integration of Live Chat feature using Socket.IO
 
 
First, we run the Fastech node app. To run it, just type "npm run start". It will run a script that will start Fastech's website. (MAKE SURE THAT YOU ARE IN THE ROOT FOLDER OF THE PROJECT!)

![image](https://user-images.githubusercontent.com/69314516/141725969-4f6e5256-b811-4ca5-818d-5b97aa03f49c.png)

Next, we'll run the chat agent's UI with the use of the command "npm run start". It is similar with the previous command to simplify the process.
![image](https://user-images.githubusercontent.com/69314516/141725988-0999dc28-4006-4c32-a2f2-6288e0e9b1b7.png)

Finally, we'll try to run the chat server. To do this, we would need to change our directory into the folder "chat_server" and run type "npm run devStart". This starts the Socket.io server that will enable live chat between the user from Fastech and the live agent.

![image](https://user-images.githubusercontent.com/69314516/141726006-783c36f5-b5f4-4156-ac01-e7ca33fd905b.png)

Now that every server is running, we can go to our different websites to see its UI. To see Fastech's UI, just go to "localhost:3000". And to view the Chat Agent's UI, just go to "localhost:3001".

 ![image](https://user-images.githubusercontent.com/69314516/141726031-0a387074-4f5f-4ef9-9d81-d883cee816d8.png)
Fastech’s UI

![image](https://user-images.githubusercontent.com/69314516/141726041-9ca93362-43e9-4d46-91fe-2f1fa32a744e.png) 
Chat Agent’s UI
