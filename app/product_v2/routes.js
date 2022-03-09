const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const crypto = require("crypto");

const productControllerV2 = require('./controller');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../../public/images');
    },
    filename: (req, file, cb) => {
        const random = crypto.randomBytes(10).toString('hex');
        cb(null, random + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/product', productControllerV2.index);
router.get('/product/:id', productControllerV2.view);
router.post('/product', upload.single('image_url'), productControllerV2.store);
router.put('/product/:id', upload.single('image_url'), productControllerV2.update);
router.delete('/product/:id', upload.single('image_url'), productControllerV2.destroy);

module.exports = router;