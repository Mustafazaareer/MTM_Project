// import express from 'express';
// import { User } from '../db/entity/User.js';
// import dataSource from '../db/datasource.js';


// const uploadImage = (req:express.Request, res:express.Response ,next:express.NextFunction) => {
//   try {
//     const user = new User();
//     user.userName = req.body.userName;
//     user.password = req.body.password;
//     dataSource.transaction(async (transactionManager: { save: (arg0: User) => any; }) => {
//       await transactionManager.save(user);
//     }).then(() => {
//       res.send('User Created');
//     }).catch(error => {
//       res.status(500).send("Something went wrong: " + error);
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Something went wrong, " + error);
//   }
// }
// export default uploadImage;