var db = require("../config/connection")


const collections = require("../config/collections");
const bcrypt = require("bcrypt");
const { PLAYER_COLLECTION } = require("../config/collections");
const { ObjectId } = require("mongodb");


module.exports = {
      
      dosignup : function(userdata){
          return new Promise(async function(resolve,reject){
              userdata.password = await bcrypt.hash(userdata.password,10)
              
                  db.get().collection(collections.USER_COLLECTION).insertOne(userdata).then(function(data){
                      resolve(data.insertedId)
                  })
              
          })
      },
      adduser : async function(userdata,callback){
        console.log(userdata);
        
       db.get().collection(collections.PLAYER_COLLECTION).insertOne(userdata).then(function(data){
            
            console.log(data.insertedId)
            callback(data.insertedId)

            
            
              
        })
    },
    dologin : function(userdata){
        
        return new Promise (async function(resolve,reject){
            let loginstatus = false
            let response = {}
            
            
            let user = await db.get().collection(collections.USER_COLLECTION).findOne({email:userdata.email})
            
            if(user){
                bcrypt.compare(userdata.key,user.password).then(function(status){
                    if(status){
                        console.log("login success")
                        
                        response.status = true
                        response.user = user
                        resolve(response)
                    }else{
                        console.log("Login failed")
                        resolve({status:false})
                    }
                })
            }else{
                console.log("Account Does'nt exists")
                resolve({status:false})
            }
        })

    },
    getuser : function(req,res){
        return new Promise (async function(resolve,reject){
            let players = await db.get().collection(collections.PLAYER_COLLECTION).find().toArray()
            resolve(players)
        })
    },contactuser: function(userId){
        return new Promise (async function(resolve,reject){
            let Oneplayer = db.get().collection(collections.PLAYER_COLLECTION).findOne({user:ObjectId(userId)})
            resolve(Oneplayer)
        })
    }
}
