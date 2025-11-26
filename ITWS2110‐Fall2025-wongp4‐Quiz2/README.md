3.1. Any design decisions that you took in completing this quiz.

For this quiz, I decided to keep the design simple and minimalistic so that it is easy to navigate and understand the purpose of the site. I chose to use the colors white, black, and gray with the font monospace. For the highlighted new project, I made it a light yellow so that it stands out.

3.2. Describe how you would handle a situation where a user came to the site for the very first time and no database existed (Think install) 

If a user came to the site for the very first time and no database existed, the site would through a PDO exception. To handle this, I would implement an installation script. This would connect to the database server with the host and username and would execute an SQL script to create the database.

3.3. How could you add functionality to prevent duplicate entries for the same project?

To prevent duplicate entries for the same project, the script checks if there is a project in the projects table with the same name. 

3.4. Suppose you want to include functionality to let people vote on the final in-class project presentations. 

3.4.1. What additional table(s) will you include to support this? 

I would add a table called votes.

3.4.2. How will you structure the data in these table(s)?

The votes table would be a junction table between users and projects. It would hold the vote int from a specific user and project. 

3.4.3. How could you add functionality to prevent users from submitting a vote to their own project?

To prevent users from submitting a vote to their own project, I would add a logic check in the PHP code before processing the vote. When the user clicks "Vote", the script would check the user and the members of the project.