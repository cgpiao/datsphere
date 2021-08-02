### Environment Variables
- DB_HOST
- DB_USERNAME
- DB_PASSWORD
- USER_USERNAME
- USER_PASSWORD
## Develop
### Sequelize
```shell
npx sequelize migration:generate --name=init-users
npx sequelize db:migrate
```

### Deploy
```shell
npm start --port=8001 --daemon --title=datsphere
```
