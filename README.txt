1)Go to ServerSide folder on the command prompt or terminal. Then, execute nodemon 
2)Open additional command prompt or terminal and go to the ClientSide folder. Then, execute npm start
3)Go to the browser and enter localhost:1234

NOTE1: Do not close the command prompt pages unless you want to stop the project.

NOTE2: If you encounter with the CORS problem and your browser is chrome, go to the path where you installed
the chrome and then enter Application folder. This folder should contain chrome.exe.
Then execute the command "chrome.exe  --user-data-dir="C:/Chrome dev session" --disable-web-security
" on the terminal.