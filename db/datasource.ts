import { DataSource } from "typeorm";
import { Application } from "./entity/Application.js";
import { CompanyProfile } from "./entity/CompanyProfile.js";
import { EmployeeProfile } from "./entity/EmployeeProfile.js";
import { Job } from "./entity/Job.js";
import { User } from "./entity/User.js";

const dataSource = new DataSource({
    type:'mysql',
    host:"localhost",
    password:"passMustafa",
    database:"traning-db",
    username:'root',
    logging:true,
    entities:[  
        Application,
        CompanyProfile,
        EmployeeProfile,
        Job,
        User],
    synchronize:true,

})

dataSource.initialize().then(()=>{
    console.log(`Success To Connected To DataBase!`)

}).catch(error=>{
    console.error(`Failed To Connect To DB: ${error}`)
})

export default dataSource;