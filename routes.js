const express=require('express')
const router=express.Router()
const passport=require('passport')
// Example protected and unprotected routes

router.get('/failed', (req, res) => res.send('Đăng nhập thất bại` '))

//Router with Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
    (req, res) => {
        res.redirect('/');
    }
);

//Router with Facebook
router.get('/facebook', passport.authenticate('facebook',{scope:'email'}));

router.get('/facebook/callback',
    passport.authenticate('facebook', {failureRedirect: '/failed' }),
    (req, res) =>{
        res.redirect('/');
    });

module.exports=router