const mongoose = require("mongoose");
// for password encryption
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        // mandatory field
        required:[true,"Please enter a name"]  
    },
    avatar:{
        public_id:String,
        url:String
    },
    email:{
        type:String,
        required:[true,"Please enter an email"],
        unique:[true,"Email already exists"]
    },
    password:{
        type:String,
        required:[true,"Please enter a password"],
        minlength:[6,"Password must be atleast 6 characters long"],
        // whenever we will access the data of any user, it will not include its password.
        // or indirectly saying that we cannot directly access this password
        select:false
    },
    //list of posts reated to a user. 
    posts:[
        {
            // will contain list of id's of post(from the post model) 
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post"
        }
    ],
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    // we have to use populate method for accessing this field(where there is a ref of other schema)
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],

    // used for forgotPassword function
    // when user wants to use forgetPassword function, then a new token(more highly encrypted) will be generated
    // which would be stored as resetPasswordToken 
    resetPasswordToken:String,
    resetPasswordExpire:Date,
});

// pre method will run just before saving the document to the database
// this async function(next)will run before saving
userSchema.pre("save",async function(next){
    // we will hash the password(into a big random string)
    // only whenever user try to change the password, if user try
    // to update email or name etc and again doc is saved in the database
    // then this will not hash the password, because password was not altered.
    // this is used to access attributes from the json object in the document of user(here) collection.
    if(this.isModified("password")){
        // 10 is the power of the hash
        // more this number greater the power of encryption
        // but increasing it more will consume more resources.
        // and performance will degrade.
        this.password = await bcrypt.hash(this.password,10);
    }
    // next is saying to execute next middleware in same route 
    // https://stackoverflow.com/questions/13133071/express-next-function-what-is-it-really-for/46122356#46122356?newreg=6655973062024d3d8f4ba7ceebcfea0c
    next();
});

//These userSchema.methods are mongoose instance methods
// which operates on instances of the model, or say on the documents of the collections.
// so we will call it by, for ex document.matchPassword
// where document can be the query object of the document.
// for ex = user(document) = User.findById(id)

// functions to check if password entered is correct by the user
userSchema.methods.matchPassword = async function(password){
    // compare the passwird that is entered by the user(during login etc) with that stored in the database.
    // Internally, first the password would be decrypted then compared.
    return await bcrypt.compare(password,this.password)
}


userSchema.methods.generateToken = function(){
    // to generate a 
    // first parameter is the payload, which is the _id of the user document.(which would be used when we decode this token again)
    // so when we decode this token(in auth.js) payload(here _id) of the document would be present, which can be used to find the document in the database
    // second parameter is the secret key(created manually by us), which is stored in config.env
    // by this a token is generated, which would be used to check to the user is authorized, for certain action or not.
    return jwt.sign({_id:this._id},process.env.JWT_SECRET);
}

userSchema.methods.getResetPasswordToken = function(){
    // crypto is an inbuilt library in node
    // This generates a random token when user selects forget password
    const resetToken = crypto.randomBytes(20).toString("hex");

    //Remember, this is used for accessing attributes of current logged in user document in the database
    //we are again encrypting the token, to make it more protected
    //sha256 is hashing algorithm used to create the hash of resetToken
    //when we create a hash we first create an instance of Hash using crypto.createHash() and 
    // then we update the hash content using the update( ) function but till now we did not get the resulting hash value 
    // So to get the hash value we use the digest function which is offered by the Hash class.
    // This function takes a string as an input which defines the type of the returning value for example hex or base64

    // This hashed resetToken(here resetPasswordToken) will be stored in the database
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Expiry is 10 mins from this time.
    this.resetPasswordExpire = Date.now() + 10*60*1000;

    //We will return the unhashed token, this will be used in email verification
    return resetToken;
}

module.exports = mongoose.model("User",userSchema);