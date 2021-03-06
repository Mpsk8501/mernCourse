const {Router} = require('express');
const router = Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const {check,validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');


// /api/auth/register
router.post(
    '/register',
    [
        check('email','incorrect email').isEmail(),
        check('password','minimum length six sign')
            .isLength({min:6})
    ],
    async (req,res)=>{
        console.log(req.body);
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array(),
                message:'incorrect registration data'
            })
        }

        const {email,password} = req.body;

        const candidate = await User.findOne({ email });

        if(candidate){
           return  res.status(400).json({message:'the user already exists '})
        }

        const hashedPassword = await bcrypt.hash(password,12);
        const user = new User({email,password:hashedPassword});
        await user.save();
        res.status(201).json({message:'user created'})

    }catch (e) {
        res.status(500).json({message: 'Catch error, try again'})
    }

});

// /api/auth/login
router.post(
    '/login',
    [
        check('email','type correct email').normalizeEmail().isEmail(),
        check('password','type password').exists()

    ],
    async (req,res)=>{
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({
                    errors:errors.array(),
                    message:'incorrect login data'
                })
            }

            const {email,password} = req.body;

            const user = await User.findOne({ email });

            if(!user){
                return res.status(400).json({message:'user not found'})
            }

            const isMatch = await bcrypt.compare(password,user.password);

            if(!isMatch){
                return res.status(400).json({message:'wrong password'})
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            );

            res.json({token,userId:user.id})



        }catch (e) {
            res.status(500).json({message: 'Catch error2, try again'})
        }
});


module.exports = router;