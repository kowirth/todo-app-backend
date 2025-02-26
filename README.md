# install NVM: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash`
1. `nvm install 22.13.0`
2. `nvm use  22.13.0`
3. `yarn add express sqlite3 cors`
- This will autmatically seed the database
4. `node server.js`
- in order to view the SQLite3 database use the following commands
5. `sqlite3 blog.db`
6. `.tables`
7. `.schema posts`
8. `SELECT * FROM posts;`