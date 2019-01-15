# LaborTrackerV2
 
Created By Michael Winberry
 
Portfolio @ https://mwinb.github.io
Other Projects @ https://github.com/mwinb
 
Labor Tracker is a tool I created to help track and predict our available labor hours. It allows the user  to keep track of the work they have done during the day, the time generated, and the percentage that they need to meet to be above or below their target goal. The user can choose from a variety of tags and see the amount of time they will accumulate for each tab. It allows for the input of the fiscal week, month, and current or previous dates. It is not neccessary for the user to change or manipulate these inputs outside of inputing previous work. The fiscal month and week are programmed to change automatically, and the current date takes advantage of the JavaScript date object. The user can then view data by year, month (fiscal), week(fiscal), or day. The user can choose to input any identifier, but initials are the default. The user inputs the hours worked, and the tags created. When submitted, an object is stored containing the information seen on the "ARA" tab.

Live version using ngrok can be found at https://labor.ngrok.io  
 
hosted at : https://github.com/mwinb/LaborTrackerV2
 
Node Requirements:
    Use npm to install:
        - mongo@2
        - body-parser
        - express
        - express-session
        - bcrypt
 
How To:
    Commands entered are OS specific. 
    1. Install Nodejs
    2. Install MongoDB
    3. git clone https://github.com/mwinb/LaborTrackerV2
    4. CD into git folder. 
    5. Open new cmd/terminal window. 
    6. Start Mongo server in new window. 
    7. In first window execute node server.js
    8. Use the URL https://localhost:3000 to view running Web App. 
     
